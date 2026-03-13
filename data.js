/* 마지막 데이터 업데이트 날짜 (GitHub Actions가 자동 갱신) */
const LAST_UPDATED = "샘플 데이터";

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
  BASE_URL: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTrade',
  MIN_SIZE_M2: 148.76,   // 45평 기준 (1평 = 3.3058㎡)
  MAX_PRICE_MANWON: 100000,  // 10억 (만원 단위)
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
const SAMPLE_DATA = [
  {
    id: 'APT001',
    name: '일산 위시티블루밍 1단지',
    district: '고양시 일산동구',
    neighborhood: '식사동',
    size평: 48.5,
    sizeM2: 160.3,
    floor: 12,
    totalFloors: 25,
    price: 72000,
    transactionDate: '2026-02',
    lat: 37.6561,
    lng: 126.7711,
    buildYear: 2014,
    priceHistory: genHistory(70000, 0.8)
  },
  {
    id: 'APT002',
    name: '고양 향동 지축 e편한세상',
    district: '고양시 덕양구',
    neighborhood: '지축동',
    size평: 46.2,
    sizeM2: 152.7,
    floor: 8,
    totalFloors: 20,
    price: 68000,
    transactionDate: '2026-01',
    lat: 37.6508,
    lng: 126.8855,
    buildYear: 2019,
    priceHistory: genHistory(65000, 0.9)
  },
  {
    id: 'APT003',
    name: '구리 갈매 롯데캐슬 시그니처',
    district: '구리시',
    neighborhood: '갈매동',
    size평: 45.8,
    sizeM2: 151.4,
    floor: 15,
    totalFloors: 30,
    price: 75000,
    transactionDate: '2026-02',
    lat: 37.5948,
    lng: 127.1407,
    buildYear: 2022,
    priceHistory: genHistory(72000, 1.0)
  },
  {
    id: 'APT004',
    name: '남양주 다산 자이 아이비플레이스',
    district: '남양주시',
    neighborhood: '다산동',
    size평: 47.3,
    sizeM2: 156.4,
    floor: 10,
    totalFloors: 22,
    price: 69000,
    transactionDate: '2026-01',
    lat: 37.6047,
    lng: 127.2106,
    buildYear: 2020,
    priceHistory: genHistory(66000, 0.7)
  },
  {
    id: 'APT005',
    name: '의정부 롯데캐슬 골든파크 2차',
    district: '의정부시',
    neighborhood: '금오동',
    size평: 46.9,
    sizeM2: 155.0,
    floor: 7,
    totalFloors: 18,
    price: 61000,
    transactionDate: '2026-02',
    lat: 37.7380,
    lng: 127.0466,
    buildYear: 2017,
    priceHistory: genHistory(59000, 0.6)
  },
  {
    id: 'APT006',
    name: '미사강변 센트럴자이',
    district: '하남시',
    neighborhood: '망월동',
    size평: 46.2,
    sizeM2: 152.7,
    floor: 20,
    totalFloors: 34,
    price: 87000,
    transactionDate: '2026-02',
    lat: 37.5478,
    lng: 127.1937,
    buildYear: 2018,
    priceHistory: genHistory(84000, 1.1)
  },
  {
    id: 'APT007',
    name: '광명 소하 e편한세상 2차',
    district: '광명시',
    neighborhood: '소하동',
    size평: 47.1,
    sizeM2: 155.7,
    floor: 6,
    totalFloors: 15,
    price: 79000,
    transactionDate: '2026-01',
    lat: 37.4273,
    lng: 126.8889,
    buildYear: 2016,
    priceHistory: genHistory(76000, 0.9)
  },
  {
    id: 'APT008',
    name: '안양 평촌 래미안 푸르지오',
    district: '안양시 동안구',
    neighborhood: '평촌동',
    size평: 50.3,
    sizeM2: 166.2,
    floor: 9,
    totalFloors: 20,
    price: 82000,
    transactionDate: '2026-02',
    lat: 37.3895,
    lng: 126.9521,
    buildYear: 2015,
    priceHistory: genHistory(79000, 0.8)
  },
  {
    id: 'APT009',
    name: '군포 산본 주공 5단지',
    district: '군포시',
    neighborhood: '산본동',
    size평: 45.5,
    sizeM2: 150.4,
    floor: 5,
    totalFloors: 15,
    price: 58000,
    transactionDate: '2026-01',
    lat: 37.3606,
    lng: 126.9348,
    buildYear: 1993,
    priceHistory: genHistory(56000, 0.5)
  },
  {
    id: 'APT010',
    name: '의왕 내손 e편한세상 센트로',
    district: '의왕시',
    neighborhood: '내손동',
    size평: 48.8,
    sizeM2: 161.3,
    floor: 11,
    totalFloors: 25,
    price: 71000,
    transactionDate: '2026-02',
    lat: 37.3761,
    lng: 126.9756,
    buildYear: 2021,
    priceHistory: genHistory(68000, 0.9)
  },
  {
    id: 'APT011',
    name: '수원 영통 아이파크 캐슬 1단지',
    district: '수원시 영통구',
    neighborhood: '영통동',
    size평: 52.1,
    sizeM2: 172.2,
    floor: 14,
    totalFloors: 28,
    price: 77000,
    transactionDate: '2026-01',
    lat: 37.2571,
    lng: 127.0547,
    buildYear: 2010,
    priceHistory: genHistory(74000, 0.7)
  },
  {
    id: 'APT012',
    name: '부천 중동 금호 어울림 2차',
    district: '부천시',
    neighborhood: '중동',
    size평: 47.6,
    sizeM2: 157.4,
    floor: 8,
    totalFloors: 20,
    price: 63000,
    transactionDate: '2026-02',
    lat: 37.5034,
    lng: 126.7660,
    buildYear: 2005,
    priceHistory: genHistory(61000, 0.6)
  },
  {
    id: 'APT013',
    name: '김포 한강 센트럴자이 2단지',
    district: '김포시',
    neighborhood: '장기동',
    size평: 49.4,
    sizeM2: 163.3,
    floor: 16,
    totalFloors: 29,
    price: 66000,
    transactionDate: '2026-01',
    lat: 37.6215,
    lng: 126.6977,
    buildYear: 2019,
    priceHistory: genHistory(63000, 0.8)
  },
  {
    id: 'APT014',
    name: '인천 청라 호반베르디움 더 퍼스트',
    district: '인천시 서구',
    neighborhood: '청라동',
    size평: 53.2,
    sizeM2: 175.8,
    floor: 18,
    totalFloors: 33,
    price: 74000,
    transactionDate: '2026-02',
    lat: 37.5339,
    lng: 126.6479,
    buildYear: 2020,
    priceHistory: genHistory(71000, 1.0)
  },
  {
    id: 'APT015',
    name: '인천 송도 더샵 퍼스트파크',
    district: '인천시 연수구',
    neighborhood: '송도동',
    size평: 55.7,
    sizeM2: 184.0,
    floor: 22,
    totalFloors: 40,
    price: 92000,
    transactionDate: '2026-02',
    lat: 37.3838,
    lng: 126.6560,
    buildYear: 2017,
    priceHistory: genHistory(88000, 1.2)
  },
  {
    id: 'APT016',
    name: '시흥 배곧 한신더휴 2차',
    district: '시흥시',
    neighborhood: '배곧동',
    size평: 46.8,
    sizeM2: 154.7,
    floor: 9,
    totalFloors: 21,
    price: 59000,
    transactionDate: '2026-01',
    lat: 37.3728,
    lng: 126.7322,
    buildYear: 2018,
    priceHistory: genHistory(57000, 0.7)
  },
  {
    id: 'APT017',
    name: '파주 운정 힐스테이트 더 클래스',
    district: '파주시',
    neighborhood: '목동동',
    size평: 48.1,
    sizeM2: 159.0,
    floor: 13,
    totalFloors: 25,
    price: 55000,
    transactionDate: '2026-02',
    lat: 37.7261,
    lng: 126.7139,
    buildYear: 2021,
    priceHistory: genHistory(53000, 0.6)
  },
  {
    id: 'APT018',
    name: '양주 옥정 중흥S클래스 파크뷰',
    district: '양주시',
    neighborhood: '옥정동',
    size평: 45.2,
    sizeM2: 149.4,
    floor: 6,
    totalFloors: 20,
    price: 49000,
    transactionDate: '2026-01',
    lat: 37.8149,
    lng: 127.0484,
    buildYear: 2022,
    priceHistory: genHistory(47000, 0.8)
  },
  {
    id: 'APT019',
    name: '동두천 생연 부영 사랑으로',
    district: '동두천시',
    neighborhood: '생연동',
    size평: 45.0,
    sizeM2: 148.8,
    floor: 4,
    totalFloors: 15,
    price: 33000,
    transactionDate: '2026-01',
    lat: 37.9011,
    lng: 127.0607,
    buildYear: 2000,
    priceHistory: genHistory(32000, 0.4)
  },
  {
    id: 'APT020',
    name: '광주 오포 e편한세상 오포파크',
    district: '광주시',
    neighborhood: '오포읍',
    size평: 46.5,
    sizeM2: 153.7,
    floor: 7,
    totalFloors: 18,
    price: 62000,
    transactionDate: '2026-02',
    lat: 37.4282,
    lng: 127.2699,
    buildYear: 2020,
    priceHistory: genHistory(59000, 0.9)
  }
];

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
