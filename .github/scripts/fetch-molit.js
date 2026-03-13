/**
 * MOLIT 실거래가 API fetch 스크립트
 * GitHub Actions에서 매월 실행 → data.js의 SAMPLE_DATA를 최신 데이터로 교체
 *
 * 환경변수: MOLIT_API_KEY (GitHub Secrets)
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_JS_PATH = path.resolve(__dirname, '../../data.js');

const API_KEY = process.env.MOLIT_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTrade';
const MIN_SIZE_M2 = 148.76;   // 45평
const MAX_PRICE = 150000;      // 15억 미만 (만원)
const SEOUL_LAT = 37.5665;
const SEOUL_LNG = 126.9780;
const RADIUS_KM = 40;

const DISTRICT_CODES = {
  '고양시':   '41281',
  '구리시':   '41310',
  '남양주시': '41360',
  '의정부시': '41150',
  '하남시':   '41450',
  '광명시':   '41210',
  '안양시':   '41171',
  '군포시':   '41390',
  '의왕시':   '41430',
  '수원시':   '41111',
  '부천시':   '41190',
  '김포시':   '41570',
  '인천시':   '28000',
  '시흥시':   '41310',
  '파주시':   '41480',
  '양주시':   '41630',
  '동두천시': '41250',
  '광주시':   '41610',
};

/** 서울시청 기준 haversine 거리 (km) */
function haversine(lat, lng) {
  const R = 6371;
  const dLat = (lat - SEOUL_LAT) * Math.PI / 180;
  const dLng = (lng - SEOUL_LNG) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(SEOUL_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180)
    * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 최근 N개월 YYYYMM 배열 */
function getPastMonths(n) {
  const result = [];
  const now = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0'));
  }
  return result;
}

/** 법정동코드로 위경도 추정 (지역 중심 좌표 테이블) */
const DISTRICT_COORDS = {
  '고양시':   [37.6584, 126.8320],
  '구리시':   [37.5943, 127.1296],
  '남양주시': [37.6359, 127.2162],
  '의정부시': [37.7381, 127.0337],
  '하남시':   [37.5391, 127.2148],
  '광명시':   [37.4784, 126.8645],
  '안양시':   [37.3943, 126.9568],
  '군포시':   [37.3614, 126.9353],
  '의왕시':   [37.3448, 126.9688],
  '수원시':   [37.2636, 127.0286],
  '부천시':   [37.5034, 126.7660],
  '김포시':   [37.6153, 126.7156],
  '인천시':   [37.4563, 126.7052],
  '시흥시':   [37.3800, 126.8031],
  '파주시':   [37.8601, 126.7874],
  '양주시':   [37.7851, 127.0456],
  '동두천시': [37.9035, 127.0601],
  '광주시':   [37.4296, 127.2558],
};

/** 한 지역 한 달치 API 호출 */
async function fetchDistrict(districtCode, dealYmd) {
  const url = new URL(BASE_URL);
  url.searchParams.set('serviceKey', API_KEY);
  url.searchParams.set('LAWD_CD', districtCode);
  url.searchParams.set('DEAL_YMD', dealYmd);
  url.searchParams.set('numOfRows', '1000');
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('_type', 'json');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const items = json?.response?.body?.items?.item || [];
  return Array.isArray(items) ? items : [items];
}

/** raw 레코드 → 내부 스키마 변환 */
function transform(raw, district, dealYmd) {
  const price = parseInt((raw.dealAmount || '').replace(/,/g, '').trim(), 10);
  const sizeM2 = parseFloat(raw.excluUseAr || 0);
  const size평 = Math.round(sizeM2 / 3.3058 * 10) / 10;
  const year = String(raw.dealYear || dealYmd.slice(0, 4));
  const month = String(raw.dealMonth || dealYmd.slice(4, 6)).padStart(2, '0');

  const [baseLat, baseLng] = DISTRICT_COORDS[district] || [SEOUL_LAT, SEOUL_LNG];
  const lat = baseLat + (Math.random() - 0.5) * 0.05;
  const lng = baseLng + (Math.random() - 0.5) * 0.05;

  return {
    name: (raw.aptNm || '').trim(),
    district,
    neighborhood: (raw.umdNm || '').trim(),
    size평,
    sizeM2,
    floor: parseInt(raw.floor || 0, 10),
    totalFloors: 0,
    price,
    transactionDate: `${year}-${month}`,
    lat,
    lng,
    buildYear: parseInt(raw.buildYear || 0, 10),
  };
}

/** 12개월 priceHistory 생성: 같은 아파트 이름의 과거 거래 내역 집계 */
function buildPriceHistory(name, allRecords) {
  const byMonth = {};
  for (const r of allRecords) {
    if (r.name === name && r.price > 0) {
      if (!byMonth[r.transactionDate]) byMonth[r.transactionDate] = [];
      byMonth[r.transactionDate].push(r.price);
    }
  }
  // 최근 12개월 배열 생성
  const result = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const prices = byMonth[ym];
    if (prices && prices.length > 0) {
      result.push({ month: ym, price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) });
    }
  }
  return result;
}

async function main() {
  if (!API_KEY) {
    console.error('MOLIT_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  const months = getPastMonths(3); // 최근 3개월
  console.log(`조회 기간: ${months.join(', ')}`);

  const allRaw = [];

  for (const [district, code] of Object.entries(DISTRICT_CODES)) {
    for (const ym of months) {
      try {
        const items = await fetchDistrict(code, ym);
        for (const item of items) {
          const rec = transform(item, district, ym);
          if (
            rec.sizeM2 >= MIN_SIZE_M2 &&
            rec.price > 0 &&
            rec.price < MAX_PRICE &&
            haversine(rec.lat, rec.lng) <= RADIUS_KM
          ) {
            allRaw.push(rec);
          }
        }
        console.log(`✓ ${district} ${ym}: ${items.length}건 조회`);
      } catch (e) {
        console.warn(`✗ ${district} ${ym} 실패: ${e.message}`);
      }
    }
  }

  console.log(`필터 후 총 ${allRaw.length}건`);

  // 중복 제거 (같은 아파트 + 같은 날짜는 첫 번째만 유지)
  const seen = new Set();
  const deduped = allRaw.filter(r => {
    const key = `${r.name}_${r.neighborhood}_${r.transactionDate}_${r.floor}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // priceHistory 추가
  const records = deduped.map((r, i) => ({
    id: `LIVE_${String(i + 1).padStart(3, '0')}`,
    ...r,
    priceHistory: buildPriceHistory(r.name, allRaw),
  }));

  // data.js 파일 읽기
  let dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');

  // LAST_UPDATED 갱신 (없으면 추가)
  const today = new Date().toISOString().slice(0, 10);
  if (dataJs.includes('const LAST_UPDATED')) {
    dataJs = dataJs.replace(/const LAST_UPDATED = "[^"]*";/, `const LAST_UPDATED = "${today}";`);
  }

  // SAMPLE_DATA 배열 교체
  const sampleDataJson = JSON.stringify(records, null, 2);
  dataJs = dataJs.replace(
    /const SAMPLE_DATA = \[[\s\S]*?\];(\s*\/\* ={10,})/,
    `const SAMPLE_DATA = ${sampleDataJson};\n\n$1`
  );

  fs.writeFileSync(DATA_JS_PATH, dataJs, 'utf8');
  console.log(`✅ data.js 업데이트 완료 (${records.length}건, ${today})`);
}

main().catch(e => {
  console.error('스크립트 실패:', e);
  process.exit(1);
});
