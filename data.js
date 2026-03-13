/* 마지막 데이터 업데이트 날짜 (GitHub Actions가 자동 갱신) */
const LAST_UPDATED = "2026-03-13";

/* ============================================================
   MOLIT API Configuration
   국토교통부 실거래가 공개시스템 연동 설정

   실제 API 사용 방법:
   1. https://www.data.go.kr 접속
   2. "아파트매매 실거래 상세 자료" 검색
   3. API 활용 신청 (승인: 1~3 영업일)
   4. 아래 API_KEY에 발급된 키 입력
   5. USE_LIVE_API: true 로 변경
   ============================================================ */
const MOLIT_CONFIG = {
  USE_LIVE_API: false,
  API_KEY: '',
  BASE_URL: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev',
  MIN_SIZE_M2: 148.76,   // 45평 기준 (1평 = 3.3058㎡)
  MAX_PRICE_MANWON: 150000,  // 15억 (만원 단위)
  RADIUS_KM: 40,
  SEOUL_LAT: 37.5665,
  SEOUL_LNG: 126.9780
};

/* 지역 법정동코드 (앞 5자리) */
const DISTRICT_CODES = {
  '고양시': '41281',
  '구리시': '41310',
  '남양주시': '41360',
  '의정부시': '41150',
  '하남시': '41450',
  '광명시': '41210',
  '안양시': '41171',
  '군포시': '41390',
  '의왕시': '41430',
  '수원시': '41111',
  '부천시': '41190',
  '김포시': '41570',
  '인천시': '28000',
  '시흥시': '41390',
  '파주시': '41480',
  '양주시': '41630',
  '동두천시': '41250',
  '광주시': '41610'
};

/* ============================================================
   Helper: Generate Realistic Price History (12 months)
   basePrice: 만원 단위, trendPct: 월 평균 변화율
   ============================================================ */
function genHistory(basePrice, trendPct = 0.5) {
  const months = [];
  const now = new Date(2026, 2, 1); // 2026-03
  let price = basePrice;

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const delta = (Math.random() * trendPct * 2 - trendPct * 0.6) / 100;
    price = Math.round(price * (1 + delta) / 100) * 100;
    months.push({ month: ym, price: Math.max(price, 10000) });
  }
  return months;
}

/* ============================================================
   Sample Data — 20 Records
   조건: 서울시청 40km 이내, 45평 이상, 10억 미만
   ============================================================ */
const SAMPLE_DATA = [];











/* ============================================================
   MOLIT API Adapter
   ============================================================ */

/** sessionStorage 캐싱 키 */
function cacheKey(districtCode, ym) {
  return `molit_${districtCode}_${ym}`;
}

/** 현재 및 이전 N개월 YYYY-MM 배열 반환 */
function getPastMonths(n) {
  const result = [];
  const d = new Date(2026, 2, 1);
  for (let i = 1; i <= n; i++) {
    const dd = new Date(d.getFullYear(), d.getMonth() - i, 1);
    result.push(dd.getFullYear() + String(dd.getMonth() + 1).padStart(2, '0'));
  }
  return result;
}

/** MOLIT API에서 한 지역 한 달치 데이터 가져오기 */
async function fetchMolitDistrict(districtCode, dealYmd) {
  const key = cacheKey(districtCode, dealYmd);
  const cached = sessionStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const proxy = 'https://corsproxy.io/?';
  const url = new URL(MOLIT_CONFIG.BASE_URL);
  url.searchParams.set('serviceKey', MOLIT_CONFIG.API_KEY);
  url.searchParams.set('LAWD_CD', districtCode);
  url.searchParams.set('DEAL_YMD', dealYmd);
  url.searchParams.set('numOfRows', '100');
  url.searchParams.set('pageNo', '1');
  url.searchParams.set('_type', 'json');

  const res = await fetch(proxy + url.toString());
  const json = await res.json();
  const items = json?.response?.body?.items?.item || [];
  const arr = Array.isArray(items) ? items : [items];
  sessionStorage.setItem(key, JSON.stringify(arr));
  return arr;
}

/** MOLIT raw record → 내부 스키마로 변환 */
function transformMolitRecord(raw, district) {
  const priceStr = (raw.dealAmount || '').replace(/,/g, '').trim();
  const price = parseInt(priceStr, 10);
  const sizeM2 = parseFloat(raw.excluUseAr || 0);
  const size평 = Math.round(sizeM2 / 3.3058 * 10) / 10;
  const month = raw.dealYear + '-' + String(raw.dealMonth).padStart(2, '0');

  return {
    id: `LIVE_${Math.random().toString(36).substr(2,8)}`,
    name: (raw.aptNm || '').trim(),
    district,
    neighborhood: (raw.umdNm || '').trim(),
    size평,
    sizeM2,
    floor: parseInt(raw.floor || 0, 10),
    totalFloors: 0,
    price,
    transactionDate: month,
    lat: 0,
    lng: 0,
    buildYear: parseInt(raw.buildYear || 0, 10),
    priceHistory: []
  };
}

/** 전체 지역 현재 달 데이터 수집 */
async function fetchAllLiveData() {
  const months = getPastMonths(1); // 최근 1개월
  const dealYmd = months[0];
  const results = [];

  for (const [district, code] of Object.entries(DISTRICT_CODES)) {
    try {
      const items = await fetchMolitDistrict(code, dealYmd);
      for (const item of items) {
        const rec = transformMolitRecord(item, district);
        if (
          rec.sizeM2 >= MOLIT_CONFIG.MIN_SIZE_M2 &&
          rec.price > 0 &&
          rec.price < MOLIT_CONFIG.MAX_PRICE_MANWON
        ) {
          results.push(rec);
        }
      }
    } catch (e) {
      console.warn(`[MOLIT] ${district} 데이터 로드 실패:`, e.message);
    }
  }

  return results;
}

/** 앱에서 호출하는 진입점 */
async function getDataSource() {
  if (MOLIT_CONFIG.USE_LIVE_API && MOLIT_CONFIG.API_KEY) {
    try {
      const live = await fetchAllLiveData();
      if (live.length > 0) return live;
    } catch (e) {
      console.warn('[MOLIT] 실시간 데이터 로드 실패, 샘플 데이터로 대체합니다.', e);
    }
  }
  return SAMPLE_DATA;
}

window.DataModule = { getDataSource, MOLIT_CONFIG, SAMPLE_DATA, LAST_UPDATED };
