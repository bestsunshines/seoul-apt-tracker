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
const SAMPLE_DATA = [
  {
    "id": "LIVE_001",
    "name": "일신건영아파트(햇빛마을)",
    "district": "고양시",
    "neighborhood": "행신동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 18,
    "totalFloors": 0,
    "price": 59100,
    "transactionDate": "2026-02",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 59000
      },
      {
        "month": "2025-11",
        "price": 63000
      },
      {
        "month": "2026-02",
        "price": 59100
      }
    ]
  },
  {
    "id": "LIVE_002",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 18,
    "totalFloors": 0,
    "price": 86500,
    "transactionDate": "2026-02",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_003",
    "name": "은빛삼익건설(5)",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 4,
    "totalFloors": 0,
    "price": 67000,
    "transactionDate": "2026-02",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-07",
        "price": 69000
      },
      {
        "month": "2026-02",
        "price": 67000
      }
    ]
  },
  {
    "id": "LIVE_004",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 3,
    "totalFloors": 0,
    "price": 88000,
    "transactionDate": "2026-02",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_005",
    "name": "달빛마을4단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 51.6,
    "sizeM2": 170.62,
    "floor": 12,
    "totalFloors": 0,
    "price": 62000,
    "transactionDate": "2026-02",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2026-02",
        "price": 62000
      }
    ]
  },
  {
    "id": "LIVE_006",
    "name": "햇빛마을",
    "district": "고양시",
    "neighborhood": "행신동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 11,
    "totalFloors": 0,
    "price": 64000,
    "transactionDate": "2026-01",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 62000
      },
      {
        "month": "2026-01",
        "price": 64000
      }
    ]
  },
  {
    "id": "LIVE_007",
    "name": "삼성래미안",
    "district": "고양시",
    "neighborhood": "성사동",
    "size평": 45.7,
    "sizeM2": 151.16,
    "floor": 18,
    "totalFloors": 0,
    "price": 73500,
    "transactionDate": "2026-01",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2026-01",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_008",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 10,
    "totalFloors": 0,
    "price": 62500,
    "transactionDate": "2026-01",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_009",
    "name": "삼성래미안",
    "district": "고양시",
    "neighborhood": "성사동",
    "size평": 45.7,
    "sizeM2": 151.16,
    "floor": 3,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2026-01",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2026-01",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_010",
    "name": "은빛마을(삼성)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.91,
    "floor": 7,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-12",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 63000
      },
      {
        "month": "2025-10",
        "price": 63500
      },
      {
        "month": "2025-12",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_011",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 10,
    "totalFloors": 0,
    "price": 64000,
    "transactionDate": "2025-12",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_012",
    "name": "일신건영아파트(햇빛마을)",
    "district": "고양시",
    "neighborhood": "행신동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 1,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-11",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 59000
      },
      {
        "month": "2025-11",
        "price": 63000
      },
      {
        "month": "2026-02",
        "price": 59100
      }
    ]
  },
  {
    "id": "LIVE_013",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 6,
    "totalFloors": 0,
    "price": 103500,
    "transactionDate": "2025-11",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_014",
    "name": "은빛마을(삼성)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.91,
    "floor": 18,
    "totalFloors": 0,
    "price": 63500,
    "transactionDate": "2025-10",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 63000
      },
      {
        "month": "2025-10",
        "price": 63500
      },
      {
        "month": "2025-12",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_015",
    "name": "은빛(미도파)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.85,
    "floor": 15,
    "totalFloors": 0,
    "price": 64000,
    "transactionDate": "2025-10",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 64000
      }
    ]
  },
  {
    "id": "LIVE_016",
    "name": "일신건영아파트(햇빛마을)",
    "district": "고양시",
    "neighborhood": "행신동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 2,
    "totalFloors": 0,
    "price": 59000,
    "transactionDate": "2025-10",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 59000
      },
      {
        "month": "2025-11",
        "price": 63000
      },
      {
        "month": "2026-02",
        "price": 59100
      }
    ]
  },
  {
    "id": "LIVE_017",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 14,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-09",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_018",
    "name": "동원텔",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.1,
    "sizeM2": 162.27,
    "floor": 5,
    "totalFloors": 0,
    "price": 48500,
    "transactionDate": "2025-08",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 48500
      }
    ]
  },
  {
    "id": "LIVE_019",
    "name": "은빛삼익건설(5)",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 7,
    "totalFloors": 0,
    "price": 69000,
    "transactionDate": "2025-07",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-07",
        "price": 69000
      },
      {
        "month": "2026-02",
        "price": 67000
      }
    ]
  },
  {
    "id": "LIVE_020",
    "name": "햇빛마을",
    "district": "고양시",
    "neighborhood": "행신동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 4,
    "totalFloors": 0,
    "price": 62000,
    "transactionDate": "2025-06",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 62000
      },
      {
        "month": "2026-01",
        "price": 64000
      }
    ]
  },
  {
    "id": "LIVE_021",
    "name": "은빛마을(삼성)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.91,
    "floor": 16,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-05",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 63000
      },
      {
        "month": "2025-10",
        "price": 63500
      },
      {
        "month": "2025-12",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_022",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 1,
    "totalFloors": 0,
    "price": 86000,
    "transactionDate": "2025-05",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_023",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 20,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-05",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_024",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 13,
    "totalFloors": 0,
    "price": 92000,
    "transactionDate": "2025-05",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_025",
    "name": "은빛마을6단지",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.7,
    "sizeM2": 164.34,
    "floor": 17,
    "totalFloors": 0,
    "price": 89000,
    "transactionDate": "2025-05",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1996,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 89000
      },
      {
        "month": "2025-11",
        "price": 103500
      },
      {
        "month": "2026-02",
        "price": 87167
      }
    ]
  },
  {
    "id": "LIVE_026",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 12,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-04",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_027",
    "name": "은빛마을(LG)5",
    "district": "고양시",
    "neighborhood": "화정동",
    "size평": 49.9,
    "sizeM2": 164.94,
    "floor": 1,
    "totalFloors": 0,
    "price": 64500,
    "transactionDate": "2025-04",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 1995,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63750
      },
      {
        "month": "2025-05",
        "price": 65000
      },
      {
        "month": "2025-09",
        "price": 63000
      },
      {
        "month": "2025-12",
        "price": 64000
      },
      {
        "month": "2026-01",
        "price": 62500
      }
    ]
  },
  {
    "id": "LIVE_028",
    "name": "삼성래미안",
    "district": "고양시",
    "neighborhood": "성사동",
    "size평": 45.7,
    "sizeM2": 151.16,
    "floor": 13,
    "totalFloors": 0,
    "price": 67000,
    "transactionDate": "2025-03",
    "lat": 37.6584,
    "lng": 126.832,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2026-01",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_029",
    "name": "원일아름",
    "district": "구리시",
    "neighborhood": "인창동",
    "size평": 52.7,
    "sizeM2": 174.37,
    "floor": 5,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2026-02",
    "lat": 37.5943,
    "lng": 127.1296,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 75000
      }
    ]
  },
  {
    "id": "LIVE_030",
    "name": "원일아름",
    "district": "구리시",
    "neighborhood": "인창동",
    "size평": 52.7,
    "sizeM2": 174.37,
    "floor": 6,
    "totalFloors": 0,
    "price": 90000,
    "transactionDate": "2025-12",
    "lat": 37.5943,
    "lng": 127.1296,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 75000
      }
    ]
  },
  {
    "id": "LIVE_031",
    "name": "원일아름",
    "district": "구리시",
    "neighborhood": "인창동",
    "size평": 54.9,
    "sizeM2": 181.48,
    "floor": 6,
    "totalFloors": 0,
    "price": 77000,
    "transactionDate": "2025-03",
    "lat": 37.5943,
    "lng": 127.1296,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 75000
      }
    ]
  },
  {
    "id": "LIVE_032",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 2,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_033",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 25,
    "totalFloors": 0,
    "price": 84000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_034",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 24,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_035",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 1,
    "totalFloors": 0,
    "price": 100000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_036",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 17,
    "totalFloors": 0,
    "price": 89500,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_037",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 3,
    "totalFloors": 0,
    "price": 77000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_038",
    "name": "우창리버빌(101)",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 48.1,
    "sizeM2": 159.06,
    "floor": 5,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2026-02",
        "price": 48000
      }
    ]
  },
  {
    "id": "LIVE_039",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 6,
    "totalFloors": 0,
    "price": 106000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_040",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 21,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_041",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 11,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_042",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 11,
    "totalFloors": 0,
    "price": 76000,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_043",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 2,
    "totalFloors": 0,
    "price": 62500,
    "transactionDate": "2026-02",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_044",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.2,
    "sizeM2": 152.59,
    "floor": 14,
    "totalFloors": 0,
    "price": 69000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_045",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 9,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_046",
    "name": "진접하우스토리",
    "district": "남양주시",
    "neighborhood": "진접읍 장현리",
    "size평": 46.2,
    "sizeM2": 152.671,
    "floor": 11,
    "totalFloors": 0,
    "price": 62000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 60000
      },
      {
        "month": "2026-01",
        "price": 62000
      }
    ]
  },
  {
    "id": "LIVE_047",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 25,
    "totalFloors": 0,
    "price": 115000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_048",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 4,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_049",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 20,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_050",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 11,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_051",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 3,
    "totalFloors": 0,
    "price": 47000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_052",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 20,
    "totalFloors": 0,
    "price": 105000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_053",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 8,
    "totalFloors": 0,
    "price": 68000,
    "transactionDate": "2026-01",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_054",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 6,
    "totalFloors": 0,
    "price": 78500,
    "transactionDate": "2025-12",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_055",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 18,
    "totalFloors": 0,
    "price": 84000,
    "transactionDate": "2025-12",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_056",
    "name": "진도",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51.2,
    "sizeM2": 169.15,
    "floor": 7,
    "totalFloors": 0,
    "price": 67500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 65500
      },
      {
        "month": "2025-11",
        "price": 67500
      }
    ]
  },
  {
    "id": "LIVE_057",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 11,
    "totalFloors": 0,
    "price": 78000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_058",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 20,
    "totalFloors": 0,
    "price": 77000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_059",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 11,
    "totalFloors": 0,
    "price": 112000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_060",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 9,
    "totalFloors": 0,
    "price": 94500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_061",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 18,
    "totalFloors": 0,
    "price": 94000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_062",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 11,
    "totalFloors": 0,
    "price": 88500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_063",
    "name": "남양주오남푸르지오",
    "district": "남양주시",
    "neighborhood": "오남읍 오남리",
    "size평": 46.2,
    "sizeM2": 152.8665,
    "floor": 14,
    "totalFloors": 0,
    "price": 55200,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 55600
      },
      {
        "month": "2025-11",
        "price": 54850
      }
    ]
  },
  {
    "id": "LIVE_064",
    "name": "남양주오남푸르지오",
    "district": "남양주시",
    "neighborhood": "오남읍 오남리",
    "size평": 46.2,
    "sizeM2": 152.8665,
    "floor": 6,
    "totalFloors": 0,
    "price": 54500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 55600
      },
      {
        "month": "2025-11",
        "price": 54850
      }
    ]
  },
  {
    "id": "LIVE_065",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 7,
    "totalFloors": 0,
    "price": 52000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_066",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 8,
    "totalFloors": 0,
    "price": 77500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_067",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 17,
    "totalFloors": 0,
    "price": 95000,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_068",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 14,
    "totalFloors": 0,
    "price": 76500,
    "transactionDate": "2025-11",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_069",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 5,
    "totalFloors": 0,
    "price": 67700,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_070",
    "name": "신도브래뉴",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 48.4,
    "sizeM2": 159.8568,
    "floor": 7,
    "totalFloors": 0,
    "price": 78000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 73500
      },
      {
        "month": "2025-10",
        "price": 78500
      }
    ]
  },
  {
    "id": "LIVE_071",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 13,
    "totalFloors": 0,
    "price": 80000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_072",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 24,
    "totalFloors": 0,
    "price": 105000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_073",
    "name": "원일에이플러스",
    "district": "남양주시",
    "neighborhood": "진접읍 장현리",
    "size평": 53.5,
    "sizeM2": 176.9,
    "floor": 4,
    "totalFloors": 0,
    "price": 37000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 33500
      },
      {
        "month": "2025-10",
        "price": 37000
      }
    ]
  },
  {
    "id": "LIVE_074",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 18,
    "totalFloors": 0,
    "price": 77000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_075",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 17,
    "totalFloors": 0,
    "price": 69000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_076",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 11,
    "totalFloors": 0,
    "price": 65500,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_077",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 7,
    "totalFloors": 0,
    "price": 62500,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_078",
    "name": "신도브래뉴",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 48.4,
    "sizeM2": 159.8568,
    "floor": 1,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 73500
      },
      {
        "month": "2025-10",
        "price": 78500
      }
    ]
  },
  {
    "id": "LIVE_079",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 14,
    "totalFloors": 0,
    "price": 77800,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_080",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 7,
    "totalFloors": 0,
    "price": 76000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_081",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 2,
    "totalFloors": 0,
    "price": 94000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_082",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 21,
    "totalFloors": 0,
    "price": 81000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_083",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 8,
    "totalFloors": 0,
    "price": 76000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_084",
    "name": "마석역신도브래뉴2차",
    "district": "남양주시",
    "neighborhood": "화도읍 묵현리",
    "size평": 46.7,
    "sizeM2": 154.4,
    "floor": 4,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2025-10",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 58000
      },
      {
        "month": "2025-10",
        "price": 48000
      }
    ]
  },
  {
    "id": "LIVE_085",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 2,
    "totalFloors": 0,
    "price": 92500,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_086",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 12,
    "totalFloors": 0,
    "price": 76700,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_087",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 4,
    "totalFloors": 0,
    "price": 75200,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_088",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 4,
    "totalFloors": 0,
    "price": 102000,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_089",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 15,
    "totalFloors": 0,
    "price": 92500,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_090",
    "name": "호평두산위브파크",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46,
    "sizeM2": 151.9269,
    "floor": 2,
    "totalFloors": 0,
    "price": 70000,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 83500
      },
      {
        "month": "2025-09",
        "price": 70000
      }
    ]
  },
  {
    "id": "LIVE_091",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 57,
    "sizeM2": 188.433,
    "floor": 12,
    "totalFloors": 0,
    "price": 132500,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_092",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 2,
    "totalFloors": 0,
    "price": 103000,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_093",
    "name": "진접하우스토리",
    "district": "남양주시",
    "neighborhood": "진접읍 장현리",
    "size평": 46.2,
    "sizeM2": 152.671,
    "floor": 13,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 60000
      },
      {
        "month": "2026-01",
        "price": 62000
      }
    ]
  },
  {
    "id": "LIVE_094",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 18,
    "totalFloors": 0,
    "price": 76500,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_095",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 16,
    "totalFloors": 0,
    "price": 49500,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_096",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 14,
    "totalFloors": 0,
    "price": 49000,
    "transactionDate": "2025-09",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_097",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 14,
    "totalFloors": 0,
    "price": 90000,
    "transactionDate": "2025-08",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_098",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 7,
    "totalFloors": 0,
    "price": 77000,
    "transactionDate": "2025-08",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_099",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 17,
    "totalFloors": 0,
    "price": 94000,
    "transactionDate": "2025-08",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_100",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 22,
    "totalFloors": 0,
    "price": 78000,
    "transactionDate": "2025-08",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_101",
    "name": "남양주오남푸르지오",
    "district": "남양주시",
    "neighborhood": "오남읍 오남리",
    "size평": 46.2,
    "sizeM2": 152.8665,
    "floor": 8,
    "totalFloors": 0,
    "price": 55600,
    "transactionDate": "2025-08",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 55600
      },
      {
        "month": "2025-11",
        "price": 54850
      }
    ]
  },
  {
    "id": "LIVE_102",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 16,
    "totalFloors": 0,
    "price": 66000,
    "transactionDate": "2025-07",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_103",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.2,
    "sizeM2": 152.59,
    "floor": 12,
    "totalFloors": 0,
    "price": 74000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_104",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 6,
    "totalFloors": 0,
    "price": 77500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_105",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 51.9,
    "sizeM2": 171.63,
    "floor": 3,
    "totalFloors": 0,
    "price": 113000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_106",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 23,
    "totalFloors": 0,
    "price": 82500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_107",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 4,
    "totalFloors": 0,
    "price": 70000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_108",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.2,
    "sizeM2": 152.59,
    "floor": 15,
    "totalFloors": 0,
    "price": 73000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_109",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 10,
    "totalFloors": 0,
    "price": 67500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_110",
    "name": "신도브래뉴",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 48.4,
    "sizeM2": 159.8568,
    "floor": 6,
    "totalFloors": 0,
    "price": 73500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 73500
      },
      {
        "month": "2025-10",
        "price": 78500
      }
    ]
  },
  {
    "id": "LIVE_111",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 3,
    "totalFloors": 0,
    "price": 74500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_112",
    "name": "호평두산위브파크",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 47.4,
    "sizeM2": 156.6555,
    "floor": 7,
    "totalFloors": 0,
    "price": 83500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 83500
      },
      {
        "month": "2025-09",
        "price": 70000
      }
    ]
  },
  {
    "id": "LIVE_113",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 6,
    "totalFloors": 0,
    "price": 52000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_114",
    "name": "진도",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51.2,
    "sizeM2": 169.15,
    "floor": 11,
    "totalFloors": 0,
    "price": 65500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 65500
      },
      {
        "month": "2025-11",
        "price": 67500
      }
    ]
  },
  {
    "id": "LIVE_115",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 63.8,
    "sizeM2": 210.98,
    "floor": 2,
    "totalFloors": 0,
    "price": 105000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_116",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 19,
    "totalFloors": 0,
    "price": 76000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_117",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.2,
    "sizeM2": 152.59,
    "floor": 8,
    "totalFloors": 0,
    "price": 57000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_118",
    "name": "진접센트레빌시티1단지",
    "district": "남양주시",
    "neighborhood": "진접읍 부평리",
    "size평": 45.4,
    "sizeM2": 150.11,
    "floor": 11,
    "totalFloors": 0,
    "price": 47500,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 50500
      },
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 52000
      },
      {
        "month": "2026-01",
        "price": 47000
      }
    ]
  },
  {
    "id": "LIVE_119",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 7,
    "totalFloors": 0,
    "price": 62000,
    "transactionDate": "2025-06",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_120",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 10,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_121",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.3,
    "sizeM2": 153.18,
    "floor": 13,
    "totalFloors": 0,
    "price": 70000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_122",
    "name": "대원칸타빌",
    "district": "남양주시",
    "neighborhood": "별내동",
    "size평": 45.7,
    "sizeM2": 151.17,
    "floor": 1,
    "totalFloors": 0,
    "price": 80000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 80000
      }
    ]
  },
  {
    "id": "LIVE_123",
    "name": "금곡GS",
    "district": "남양주시",
    "neighborhood": "금곡동",
    "size평": 47,
    "sizeM2": 155.28,
    "floor": 18,
    "totalFloors": 0,
    "price": 55000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 1997,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 55000
      }
    ]
  },
  {
    "id": "LIVE_124",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 57.1,
    "sizeM2": 188.76,
    "floor": 5,
    "totalFloors": 0,
    "price": 93000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_125",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 7,
    "totalFloors": 0,
    "price": 74500,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_126",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 7,
    "totalFloors": 0,
    "price": 82000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_127",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 6,
    "totalFloors": 0,
    "price": 93000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_128",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 21,
    "totalFloors": 0,
    "price": 80000,
    "transactionDate": "2025-05",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_129",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 11,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_130",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 46.2,
    "sizeM2": 152.59,
    "floor": 18,
    "totalFloors": 0,
    "price": 59000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_131",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 23,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_132",
    "name": "마석역신도브래뉴2차",
    "district": "남양주시",
    "neighborhood": "화도읍 묵현리",
    "size평": 46.7,
    "sizeM2": 154.4,
    "floor": 7,
    "totalFloors": 0,
    "price": 58000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 58000
      },
      {
        "month": "2025-10",
        "price": 48000
      }
    ]
  },
  {
    "id": "LIVE_133",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 14,
    "totalFloors": 0,
    "price": 86300,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_134",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 8,
    "totalFloors": 0,
    "price": 101000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_135",
    "name": "신영지웰",
    "district": "남양주시",
    "neighborhood": "진접읍 금곡리",
    "size평": 47.1,
    "sizeM2": 155.773,
    "floor": 10,
    "totalFloors": 0,
    "price": 67500,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 67500
      },
      {
        "month": "2025-06",
        "price": 68750
      },
      {
        "month": "2025-10",
        "price": 67700
      },
      {
        "month": "2026-02",
        "price": 69250
      }
    ]
  },
  {
    "id": "LIVE_136",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 20,
    "totalFloors": 0,
    "price": 79300,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_137",
    "name": "원일에이플러스",
    "district": "남양주시",
    "neighborhood": "진접읍 장현리",
    "size평": 49.6,
    "sizeM2": 163.88,
    "floor": 9,
    "totalFloors": 0,
    "price": 33500,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 33500
      },
      {
        "month": "2025-10",
        "price": 37000
      }
    ]
  },
  {
    "id": "LIVE_138",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 63.8,
    "sizeM2": 210.98,
    "floor": 2,
    "totalFloors": 0,
    "price": 116000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_139",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 51.9,
    "sizeM2": 171.63,
    "floor": 3,
    "totalFloors": 0,
    "price": 95000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_140",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 3,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_141",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 18,
    "totalFloors": 0,
    "price": 79500,
    "transactionDate": "2025-04",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_142",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 20,
    "totalFloors": 0,
    "price": 78500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_143",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 18,
    "totalFloors": 0,
    "price": 77500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_144",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 60.8,
    "sizeM2": 200.899,
    "floor": 2,
    "totalFloors": 0,
    "price": 135000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_145",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 12,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_146",
    "name": "호평파라곤",
    "district": "남양주시",
    "neighborhood": "호평동",
    "size평": 63.8,
    "sizeM2": 210.98,
    "floor": 4,
    "totalFloors": 0,
    "price": 120000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 90000
      },
      {
        "month": "2025-05",
        "price": 70000
      },
      {
        "month": "2025-06",
        "price": 80667
      },
      {
        "month": "2025-07",
        "price": 66000
      },
      {
        "month": "2025-10",
        "price": 65667
      },
      {
        "month": "2026-01",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_147",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 9,
    "totalFloors": 0,
    "price": 78500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_148",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 10,
    "totalFloors": 0,
    "price": 81500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_149",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 5,
    "totalFloors": 0,
    "price": 82000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_150",
    "name": "진접하우스토리",
    "district": "남양주시",
    "neighborhood": "진접읍 장현리",
    "size평": 46.2,
    "sizeM2": 152.671,
    "floor": 11,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 60000
      },
      {
        "month": "2026-01",
        "price": 62000
      }
    ]
  },
  {
    "id": "LIVE_151",
    "name": "플루리움2단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 21,
    "totalFloors": 0,
    "price": 81000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 79300
      },
      {
        "month": "2025-05",
        "price": 77250
      },
      {
        "month": "2025-06",
        "price": 74500
      },
      {
        "month": "2025-09",
        "price": 76500
      },
      {
        "month": "2025-11",
        "price": 76750
      }
    ]
  },
  {
    "id": "LIVE_152",
    "name": "플루리움1단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 4,
    "totalFloors": 0,
    "price": 79500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80667
      },
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-06",
        "price": 76750
      },
      {
        "month": "2025-08",
        "price": 77000
      },
      {
        "month": "2025-09",
        "price": 103000
      },
      {
        "month": "2025-10",
        "price": 77400
      },
      {
        "month": "2025-11",
        "price": 86500
      },
      {
        "month": "2025-12",
        "price": 78500
      },
      {
        "month": "2026-01",
        "price": 79000
      },
      {
        "month": "2026-02",
        "price": 79833
      }
    ]
  },
  {
    "id": "LIVE_153",
    "name": "덕소두산위브",
    "district": "남양주시",
    "neighborhood": "와부읍 도곡리",
    "size평": 51.4,
    "sizeM2": 169.788,
    "floor": 18,
    "totalFloors": 0,
    "price": 86000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 85000
      },
      {
        "month": "2025-05",
        "price": 85000
      },
      {
        "month": "2025-06",
        "price": 82500
      },
      {
        "month": "2025-08",
        "price": 94000
      },
      {
        "month": "2025-09",
        "price": 118625
      },
      {
        "month": "2025-11",
        "price": 91250
      },
      {
        "month": "2026-01",
        "price": 92000
      },
      {
        "month": "2026-02",
        "price": 95000
      }
    ]
  },
  {
    "id": "LIVE_154",
    "name": "덕소강변현대",
    "district": "남양주시",
    "neighborhood": "와부읍 덕소리",
    "size평": 51,
    "sizeM2": 168.75,
    "floor": 20,
    "totalFloors": 0,
    "price": 100000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 93000
      },
      {
        "month": "2025-09",
        "price": 92500
      },
      {
        "month": "2025-11",
        "price": 103250
      },
      {
        "month": "2026-02",
        "price": 85000
      }
    ]
  },
  {
    "id": "LIVE_155",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 18,
    "totalFloors": 0,
    "price": 87000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_156",
    "name": "플루리움3단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 8,
    "totalFloors": 0,
    "price": 79500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 80650
      },
      {
        "month": "2025-05",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 78000
      },
      {
        "month": "2025-10",
        "price": 90500
      },
      {
        "month": "2025-11",
        "price": 77500
      }
    ]
  },
  {
    "id": "LIVE_157",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 49.1,
    "sizeM2": 162.454,
    "floor": 24,
    "totalFloors": 0,
    "price": 83500,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_158",
    "name": "플루리움4,5단지",
    "district": "남양주시",
    "neighborhood": "다산동",
    "size평": 55.3,
    "sizeM2": 182.767,
    "floor": 25,
    "totalFloors": 0,
    "price": 104000,
    "transactionDate": "2025-03",
    "lat": 37.6359,
    "lng": 127.2162,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 101000
      },
      {
        "month": "2025-08",
        "price": 90000
      },
      {
        "month": "2025-09",
        "price": 75950
      },
      {
        "month": "2025-10",
        "price": 82750
      },
      {
        "month": "2025-12",
        "price": 84000
      },
      {
        "month": "2026-01",
        "price": 91000
      },
      {
        "month": "2026-02",
        "price": 86667
      }
    ]
  },
  {
    "id": "LIVE_159",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 1,
    "totalFloors": 0,
    "price": 71500,
    "transactionDate": "2025-11",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_160",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 9,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-09",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_161",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 9,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-06",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_162",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 3,
    "totalFloors": 0,
    "price": 71000,
    "transactionDate": "2025-06",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_163",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 19,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2025-04",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_164",
    "name": "신일유토빌",
    "district": "의정부시",
    "neighborhood": "호원동",
    "size평": 45.1,
    "sizeM2": 148.98,
    "floor": 3,
    "totalFloors": 0,
    "price": 78000,
    "transactionDate": "2025-03",
    "lat": 37.7381,
    "lng": 127.0337,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 75000
      },
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-09",
        "price": 79000
      },
      {
        "month": "2025-11",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_165",
    "name": "하남두산위브파크",
    "district": "하남시",
    "neighborhood": "신장동",
    "size평": 46.5,
    "sizeM2": 153.67,
    "floor": 11,
    "totalFloors": 0,
    "price": 108000,
    "transactionDate": "2025-07",
    "lat": 37.5391,
    "lng": 127.2148,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-07",
        "price": 108000
      }
    ]
  },
  {
    "id": "LIVE_166",
    "name": "동일하이빌",
    "district": "하남시",
    "neighborhood": "신장동",
    "size평": 54.9,
    "sizeM2": 181.64,
    "floor": 9,
    "totalFloors": 0,
    "price": 86000,
    "transactionDate": "2025-04",
    "lat": 37.5391,
    "lng": 127.2148,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 86000
      }
    ]
  },
  {
    "id": "LIVE_167",
    "name": "동일하이빌",
    "district": "하남시",
    "neighborhood": "신장동",
    "size평": 51,
    "sizeM2": 168.65,
    "floor": 9,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-03",
    "lat": 37.5391,
    "lng": 127.2148,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 86000
      }
    ]
  },
  {
    "id": "LIVE_168",
    "name": "하남두산위브파크",
    "district": "하남시",
    "neighborhood": "신장동",
    "size평": 46.5,
    "sizeM2": 153.67,
    "floor": 14,
    "totalFloors": 0,
    "price": 105000,
    "transactionDate": "2025-03",
    "lat": 37.5391,
    "lng": 127.2148,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-07",
        "price": 108000
      }
    ]
  },
  {
    "id": "LIVE_169",
    "name": "동일하이빌",
    "district": "하남시",
    "neighborhood": "신장동",
    "size평": 51,
    "sizeM2": 168.65,
    "floor": 8,
    "totalFloors": 0,
    "price": 92000,
    "transactionDate": "2025-03",
    "lat": 37.5391,
    "lng": 127.2148,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 86000
      }
    ]
  },
  {
    "id": "LIVE_170",
    "name": "한라비발디",
    "district": "안양시",
    "neighborhood": "박달동",
    "size평": 53,
    "sizeM2": 175.236,
    "floor": 12,
    "totalFloors": 0,
    "price": 76500,
    "transactionDate": "2026-01",
    "lat": 37.3943,
    "lng": 126.9568,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2026-01",
        "price": 76500
      }
    ]
  },
  {
    "id": "LIVE_171",
    "name": "신안",
    "district": "안양시",
    "neighborhood": "박달동",
    "size평": 47.4,
    "sizeM2": 156.66,
    "floor": 10,
    "totalFloors": 0,
    "price": 43000,
    "transactionDate": "2025-07",
    "lat": 37.3943,
    "lng": 126.9568,
    "buildYear": 1991,
    "priceHistory": [
      {
        "month": "2025-07",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_172",
    "name": "풍림아이원1차",
    "district": "군포시",
    "neighborhood": "월곶동",
    "size평": 60.5,
    "sizeM2": 199.88,
    "floor": 4,
    "totalFloors": 0,
    "price": 49000,
    "transactionDate": "2026-01",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 57000
      },
      {
        "month": "2025-12",
        "price": 44365
      },
      {
        "month": "2026-01",
        "price": 49000
      }
    ]
  },
  {
    "id": "LIVE_173",
    "name": "풍림아이원1차",
    "district": "군포시",
    "neighborhood": "월곶동",
    "size평": 60.5,
    "sizeM2": 199.88,
    "floor": 7,
    "totalFloors": 0,
    "price": 43230,
    "transactionDate": "2025-12",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 57000
      },
      {
        "month": "2025-12",
        "price": 44365
      },
      {
        "month": "2026-01",
        "price": 49000
      }
    ]
  },
  {
    "id": "LIVE_174",
    "name": "풍림아이원1차",
    "district": "군포시",
    "neighborhood": "월곶동",
    "size평": 60.5,
    "sizeM2": 199.88,
    "floor": 16,
    "totalFloors": 0,
    "price": 45500,
    "transactionDate": "2025-12",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 57000
      },
      {
        "month": "2025-12",
        "price": 44365
      },
      {
        "month": "2026-01",
        "price": 49000
      }
    ]
  },
  {
    "id": "LIVE_175",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 6,
    "totalFloors": 0,
    "price": 45000,
    "transactionDate": "2025-11",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_176",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 7,
    "totalFloors": 0,
    "price": 47000,
    "transactionDate": "2025-09",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_177",
    "name": "풍림아이원1차",
    "district": "군포시",
    "neighborhood": "월곶동",
    "size평": 60.5,
    "sizeM2": 199.88,
    "floor": 19,
    "totalFloors": 0,
    "price": 57000,
    "transactionDate": "2025-08",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 57000
      },
      {
        "month": "2025-12",
        "price": 44365
      },
      {
        "month": "2026-01",
        "price": 49000
      }
    ]
  },
  {
    "id": "LIVE_178",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 16,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2025-07",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_179",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 7,
    "totalFloors": 0,
    "price": 46500,
    "transactionDate": "2025-04",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_180",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 8,
    "totalFloors": 0,
    "price": 48500,
    "transactionDate": "2025-04",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_181",
    "name": "해가든더클래식",
    "district": "군포시",
    "neighborhood": "미산동",
    "size평": 45,
    "sizeM2": 148.8,
    "floor": 4,
    "totalFloors": 0,
    "price": 45500,
    "transactionDate": "2025-04",
    "lat": 37.3614,
    "lng": 126.9353,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 46833
      },
      {
        "month": "2025-07",
        "price": 48000
      },
      {
        "month": "2025-09",
        "price": 47000
      },
      {
        "month": "2025-11",
        "price": 45000
      }
    ]
  },
  {
    "id": "LIVE_182",
    "name": "의왕내손e편한세상",
    "district": "의왕시",
    "neighborhood": "내손동",
    "size평": 47.9,
    "sizeM2": 158.311,
    "floor": 21,
    "totalFloors": 0,
    "price": 120000,
    "transactionDate": "2025-10",
    "lat": 37.3448,
    "lng": 126.9688,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 125000
      },
      {
        "month": "2025-09",
        "price": 121500
      },
      {
        "month": "2025-10",
        "price": 120000
      }
    ]
  },
  {
    "id": "LIVE_183",
    "name": "의왕내손e편한세상",
    "district": "의왕시",
    "neighborhood": "내손동",
    "size평": 47.9,
    "sizeM2": 158.416,
    "floor": 4,
    "totalFloors": 0,
    "price": 121500,
    "transactionDate": "2025-09",
    "lat": 37.3448,
    "lng": 126.9688,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 125000
      },
      {
        "month": "2025-09",
        "price": 121500
      },
      {
        "month": "2025-10",
        "price": 120000
      }
    ]
  },
  {
    "id": "LIVE_184",
    "name": "의왕내손e편한세상",
    "district": "의왕시",
    "neighborhood": "내손동",
    "size평": 47.9,
    "sizeM2": 158.416,
    "floor": 13,
    "totalFloors": 0,
    "price": 125000,
    "transactionDate": "2025-05",
    "lat": 37.3448,
    "lng": 126.9688,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 125000
      },
      {
        "month": "2025-09",
        "price": 121500
      },
      {
        "month": "2025-10",
        "price": 120000
      }
    ]
  },
  {
    "id": "LIVE_185",
    "name": "진달래(LG)",
    "district": "의왕시",
    "neighborhood": "오전동",
    "size평": 45.2,
    "sizeM2": 149.31,
    "floor": 2,
    "totalFloors": 0,
    "price": 66000,
    "transactionDate": "2025-03",
    "lat": 37.3448,
    "lng": 126.9688,
    "buildYear": 1998,
    "priceHistory": []
  },
  {
    "id": "LIVE_186",
    "name": "의왕내손e편한세상",
    "district": "의왕시",
    "neighborhood": "내손동",
    "size평": 47.9,
    "sizeM2": 158.311,
    "floor": 23,
    "totalFloors": 0,
    "price": 123000,
    "transactionDate": "2025-03",
    "lat": 37.3448,
    "lng": 126.9688,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 125000
      },
      {
        "month": "2025-09",
        "price": 121500
      },
      {
        "month": "2025-10",
        "price": 120000
      }
    ]
  },
  {
    "id": "LIVE_187",
    "name": "청솔마을SK한화",
    "district": "수원시",
    "neighborhood": "정자동",
    "size평": 47.6,
    "sizeM2": 157.439,
    "floor": 2,
    "totalFloors": 0,
    "price": 82000,
    "transactionDate": "2026-02",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 83000
      },
      {
        "month": "2025-07",
        "price": 84000
      },
      {
        "month": "2025-11",
        "price": 82000
      },
      {
        "month": "2026-02",
        "price": 82000
      }
    ]
  },
  {
    "id": "LIVE_188",
    "name": "청솔마을SK한화",
    "district": "수원시",
    "neighborhood": "정자동",
    "size평": 47.6,
    "sizeM2": 157.439,
    "floor": 9,
    "totalFloors": 0,
    "price": 82000,
    "transactionDate": "2025-11",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 83000
      },
      {
        "month": "2025-07",
        "price": 84000
      },
      {
        "month": "2025-11",
        "price": 82000
      },
      {
        "month": "2026-02",
        "price": 82000
      }
    ]
  },
  {
    "id": "LIVE_189",
    "name": "청솔마을SK한화",
    "district": "수원시",
    "neighborhood": "정자동",
    "size평": 47.6,
    "sizeM2": 157.439,
    "floor": 12,
    "totalFloors": 0,
    "price": 84000,
    "transactionDate": "2025-07",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 83000
      },
      {
        "month": "2025-07",
        "price": 84000
      },
      {
        "month": "2025-11",
        "price": 82000
      },
      {
        "month": "2026-02",
        "price": 82000
      }
    ]
  },
  {
    "id": "LIVE_190",
    "name": "청솔마을SK한화",
    "district": "수원시",
    "neighborhood": "정자동",
    "size평": 47.6,
    "sizeM2": 157.439,
    "floor": 23,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2025-05",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 83000
      },
      {
        "month": "2025-07",
        "price": 84000
      },
      {
        "month": "2025-11",
        "price": 82000
      },
      {
        "month": "2026-02",
        "price": 82000
      }
    ]
  },
  {
    "id": "LIVE_191",
    "name": "한일타운대림",
    "district": "수원시",
    "neighborhood": "조원동",
    "size평": 49.9,
    "sizeM2": 164.935,
    "floor": 2,
    "totalFloors": 0,
    "price": 71500,
    "transactionDate": "2025-04",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_192",
    "name": "한일타운대림",
    "district": "수원시",
    "neighborhood": "조원동",
    "size평": 49.9,
    "sizeM2": 164.935,
    "floor": 9,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2025-03",
    "lat": 37.2636,
    "lng": 127.0286,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 71500
      }
    ]
  },
  {
    "id": "LIVE_193",
    "name": "전원마을(월드3차1단지)",
    "district": "김포시",
    "neighborhood": "운양동",
    "size평": 49.9,
    "sizeM2": 164.835,
    "floor": 13,
    "totalFloors": 0,
    "price": 42000,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1999,
    "priceHistory": [
      {
        "month": "2026-02",
        "price": 42000
      }
    ]
  },
  {
    "id": "LIVE_194",
    "name": "전원마을(월드5차3단지)",
    "district": "김포시",
    "neighborhood": "운양동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 8,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 43500
      },
      {
        "month": "2026-02",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_195",
    "name": "오스타파라곤3단지",
    "district": "김포시",
    "neighborhood": "걸포동",
    "size평": 47.7,
    "sizeM2": 157.63,
    "floor": 8,
    "totalFloors": 0,
    "price": 68500,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-07",
        "price": 67000
      },
      {
        "month": "2025-08",
        "price": 80000
      },
      {
        "month": "2026-02",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_196",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 53.4,
    "sizeM2": 176.65,
    "floor": 6,
    "totalFloors": 0,
    "price": 50500,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_197",
    "name": "수기마을힐스테이트3단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 49.7,
    "sizeM2": 164.26,
    "floor": 2,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 99000
      },
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 83000
      }
    ]
  },
  {
    "id": "LIVE_198",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 16,
    "totalFloors": 0,
    "price": 54300,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_199",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 53.4,
    "sizeM2": 176.65,
    "floor": 1,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2026-02",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_200",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 9,
    "totalFloors": 0,
    "price": 43000,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_201",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 8,
    "totalFloors": 0,
    "price": 59900,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_202",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 59.5,
    "sizeM2": 196.7425,
    "floor": 3,
    "totalFloors": 0,
    "price": 56000,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_203",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 18,
    "totalFloors": 0,
    "price": 45000,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_204",
    "name": "수기마을힐스테이트2단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 46,
    "sizeM2": 152.07,
    "floor": 8,
    "totalFloors": 0,
    "price": 87700,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 90000
      },
      {
        "month": "2026-01",
        "price": 87700
      }
    ]
  },
  {
    "id": "LIVE_205",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 2,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_206",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 8,
    "totalFloors": 0,
    "price": 54000,
    "transactionDate": "2026-01",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_207",
    "name": "장릉마을(삼성쉐르빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 57.2,
    "sizeM2": 189.22,
    "floor": 14,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 39000
      },
      {
        "month": "2025-11",
        "price": 39500
      },
      {
        "month": "2025-12",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_208",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 6,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_209",
    "name": "수기마을힐스테이트3단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 49.7,
    "sizeM2": 164.26,
    "floor": 12,
    "totalFloors": 0,
    "price": 90000,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 99000
      },
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 83000
      }
    ]
  },
  {
    "id": "LIVE_210",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 65.8,
    "sizeM2": 217.5,
    "floor": 14,
    "totalFloors": 0,
    "price": 65700,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_211",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 65.8,
    "sizeM2": 217.5,
    "floor": 19,
    "totalFloors": 0,
    "price": 78000,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_212",
    "name": "풍무자이2단지",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 47.2,
    "sizeM2": 156.0857,
    "floor": 3,
    "totalFloors": 0,
    "price": 59500,
    "transactionDate": "2025-12",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 65000
      },
      {
        "month": "2025-06",
        "price": 60000
      },
      {
        "month": "2025-12",
        "price": 59500
      }
    ]
  },
  {
    "id": "LIVE_213",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 9,
    "totalFloors": 0,
    "price": 51500,
    "transactionDate": "2025-11",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_214",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 2,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2025-11",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_215",
    "name": "장릉마을(삼성쉐르빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 57.2,
    "sizeM2": 189.22,
    "floor": 10,
    "totalFloors": 0,
    "price": 39500,
    "transactionDate": "2025-11",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 39000
      },
      {
        "month": "2025-11",
        "price": 39500
      },
      {
        "month": "2025-12",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_216",
    "name": "수기마을힐스테이트2단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 46,
    "sizeM2": 152.07,
    "floor": 12,
    "totalFloors": 0,
    "price": 90000,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 90000
      },
      {
        "month": "2026-01",
        "price": 87700
      }
    ]
  },
  {
    "id": "LIVE_217",
    "name": "농장마을(신안)",
    "district": "김포시",
    "neighborhood": "사우동",
    "size평": 50.9,
    "sizeM2": 168.33,
    "floor": 10,
    "totalFloors": 0,
    "price": 37500,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 33000
      },
      {
        "month": "2025-06",
        "price": 36500
      },
      {
        "month": "2025-07",
        "price": 37500
      },
      {
        "month": "2025-10",
        "price": 37500
      }
    ]
  },
  {
    "id": "LIVE_218",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 4,
    "totalFloors": 0,
    "price": 47300,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_219",
    "name": "전원마을(월드4차2단지)",
    "district": "김포시",
    "neighborhood": "운양동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 4,
    "totalFloors": 0,
    "price": 37000,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 40000
      },
      {
        "month": "2025-10",
        "price": 37000
      }
    ]
  },
  {
    "id": "LIVE_220",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 10,
    "totalFloors": 0,
    "price": 74000,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_221",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 65.8,
    "sizeM2": 217.5,
    "floor": 17,
    "totalFloors": 0,
    "price": 69000,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_222",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 59.5,
    "sizeM2": 196.7425,
    "floor": 2,
    "totalFloors": 0,
    "price": 47000,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_223",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 46.4,
    "sizeM2": 153.488,
    "floor": 8,
    "totalFloors": 0,
    "price": 55500,
    "transactionDate": "2025-10",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_224",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 18,
    "totalFloors": 0,
    "price": 43000,
    "transactionDate": "2025-09",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_225",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 53.4,
    "sizeM2": 176.65,
    "floor": 14,
    "totalFloors": 0,
    "price": 50000,
    "transactionDate": "2025-09",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_226",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 7,
    "totalFloors": 0,
    "price": 43800,
    "transactionDate": "2025-09",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_227",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 9,
    "totalFloors": 0,
    "price": 59000,
    "transactionDate": "2025-09",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_228",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 15,
    "totalFloors": 0,
    "price": 50900,
    "transactionDate": "2025-09",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_229",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 59.5,
    "sizeM2": 196.7425,
    "floor": 3,
    "totalFloors": 0,
    "price": 52000,
    "transactionDate": "2025-08",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_230",
    "name": "오스타파라곤3단지",
    "district": "김포시",
    "neighborhood": "걸포동",
    "size평": 47.7,
    "sizeM2": 157.63,
    "floor": 16,
    "totalFloors": 0,
    "price": 80000,
    "transactionDate": "2025-08",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-07",
        "price": 67000
      },
      {
        "month": "2025-08",
        "price": 80000
      },
      {
        "month": "2026-02",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_231",
    "name": "전원마을(월드5차3단지)",
    "district": "김포시",
    "neighborhood": "운양동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 15,
    "totalFloors": 0,
    "price": 43500,
    "transactionDate": "2025-08",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 43500
      },
      {
        "month": "2026-02",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_232",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 59.5,
    "sizeM2": 196.7425,
    "floor": 12,
    "totalFloors": 0,
    "price": 52000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_233",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 16,
    "totalFloors": 0,
    "price": 46800,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_234",
    "name": "농장마을(신안)",
    "district": "김포시",
    "neighborhood": "사우동",
    "size평": 50.9,
    "sizeM2": 168.33,
    "floor": 6,
    "totalFloors": 0,
    "price": 37500,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 33000
      },
      {
        "month": "2025-06",
        "price": 36500
      },
      {
        "month": "2025-07",
        "price": 37500
      },
      {
        "month": "2025-10",
        "price": 37500
      }
    ]
  },
  {
    "id": "LIVE_235",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 3,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_236",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 15,
    "totalFloors": 0,
    "price": 70000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_237",
    "name": "푸른마을(신안)",
    "district": "김포시",
    "neighborhood": "감정동",
    "size평": 61.2,
    "sizeM2": 202.194,
    "floor": 7,
    "totalFloors": 0,
    "price": 44000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 27000
      },
      {
        "month": "2025-07",
        "price": 44000
      }
    ]
  },
  {
    "id": "LIVE_238",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 9,
    "totalFloors": 0,
    "price": 90000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_239",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 5,
    "totalFloors": 0,
    "price": 72000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_240",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 6,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_241",
    "name": "오스타파라곤3단지",
    "district": "김포시",
    "neighborhood": "걸포동",
    "size평": 47.6,
    "sizeM2": 157.42,
    "floor": 2,
    "totalFloors": 0,
    "price": 67000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-07",
        "price": 67000
      },
      {
        "month": "2025-08",
        "price": 80000
      },
      {
        "month": "2026-02",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_242",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 20,
    "totalFloors": 0,
    "price": 68000,
    "transactionDate": "2025-07",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_243",
    "name": "풍무자이2단지",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 47.2,
    "sizeM2": 156.0857,
    "floor": 12,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 65000
      },
      {
        "month": "2025-06",
        "price": 60000
      },
      {
        "month": "2025-12",
        "price": 59500
      }
    ]
  },
  {
    "id": "LIVE_244",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 4,
    "totalFloors": 0,
    "price": 61000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_245",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 5,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_246",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 3,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_247",
    "name": "오스타파라곤3단지",
    "district": "김포시",
    "neighborhood": "걸포동",
    "size평": 47.7,
    "sizeM2": 157.54,
    "floor": 21,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-07",
        "price": 67000
      },
      {
        "month": "2025-08",
        "price": 80000
      },
      {
        "month": "2026-02",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_248",
    "name": "유현마을(현대프라임빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 65.8,
    "sizeM2": 217.5,
    "floor": 2,
    "totalFloors": 0,
    "price": 68500,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2003,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 68500
      },
      {
        "month": "2025-09",
        "price": 50000
      },
      {
        "month": "2025-10",
        "price": 69000
      },
      {
        "month": "2025-12",
        "price": 71850
      },
      {
        "month": "2026-02",
        "price": 55250
      }
    ]
  },
  {
    "id": "LIVE_249",
    "name": "김포한강신안실크밸리3차",
    "district": "김포시",
    "neighborhood": "감정동",
    "size평": 46.4,
    "sizeM2": 153.2305,
    "floor": 13,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2012,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 60000
      }
    ]
  },
  {
    "id": "LIVE_250",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 17,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_251",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 9,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_252",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 59.5,
    "sizeM2": 196.7425,
    "floor": 7,
    "totalFloors": 0,
    "price": 50000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_253",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 14,
    "totalFloors": 0,
    "price": 64000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_254",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 2,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_255",
    "name": "농장마을(신안)",
    "district": "김포시",
    "neighborhood": "사우동",
    "size평": 50.9,
    "sizeM2": 168.33,
    "floor": 14,
    "totalFloors": 0,
    "price": 36500,
    "transactionDate": "2025-06",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 33000
      },
      {
        "month": "2025-06",
        "price": 36500
      },
      {
        "month": "2025-07",
        "price": 37500
      },
      {
        "month": "2025-10",
        "price": 37500
      }
    ]
  },
  {
    "id": "LIVE_256",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 1,
    "totalFloors": 0,
    "price": 52500,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_257",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 3,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_258",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 8,
    "totalFloors": 0,
    "price": 71000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_259",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 13,
    "totalFloors": 0,
    "price": 43500,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_260",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 5,
    "totalFloors": 0,
    "price": 61000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_261",
    "name": "농장마을(신안)",
    "district": "김포시",
    "neighborhood": "사우동",
    "size평": 50.9,
    "sizeM2": 168.33,
    "floor": 1,
    "totalFloors": 0,
    "price": 30000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 33000
      },
      {
        "month": "2025-06",
        "price": 36500
      },
      {
        "month": "2025-07",
        "price": 37500
      },
      {
        "month": "2025-10",
        "price": 37500
      }
    ]
  },
  {
    "id": "LIVE_262",
    "name": "농장마을(신안)",
    "district": "김포시",
    "neighborhood": "사우동",
    "size평": 50.9,
    "sizeM2": 168.33,
    "floor": 6,
    "totalFloors": 0,
    "price": 36000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 1998,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 33000
      },
      {
        "month": "2025-06",
        "price": 36500
      },
      {
        "month": "2025-07",
        "price": 37500
      },
      {
        "month": "2025-10",
        "price": 37500
      }
    ]
  },
  {
    "id": "LIVE_263",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 15,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_264",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 5,
    "totalFloors": 0,
    "price": 46900,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_265",
    "name": "양도마을(서해그랑블)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 50.7,
    "sizeM2": 167.6654,
    "floor": 15,
    "totalFloors": 0,
    "price": 34000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 50000
      },
      {
        "month": "2025-07",
        "price": 49400
      },
      {
        "month": "2025-08",
        "price": 52000
      },
      {
        "month": "2025-09",
        "price": 46950
      },
      {
        "month": "2025-10",
        "price": 47150
      },
      {
        "month": "2025-11",
        "price": 52033
      },
      {
        "month": "2026-01",
        "price": 49667
      }
    ]
  },
  {
    "id": "LIVE_266",
    "name": "수기마을힐스테이트3단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 47.5,
    "sizeM2": 156.91,
    "floor": 11,
    "totalFloors": 0,
    "price": 99000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 99000
      },
      {
        "month": "2025-12",
        "price": 90000
      },
      {
        "month": "2026-02",
        "price": 83000
      }
    ]
  },
  {
    "id": "LIVE_267",
    "name": "장릉마을(삼성쉐르빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 57.2,
    "sizeM2": 189.22,
    "floor": 8,
    "totalFloors": 0,
    "price": 39000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 39000
      },
      {
        "month": "2025-11",
        "price": 39500
      },
      {
        "month": "2025-12",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_268",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 6,
    "totalFloors": 0,
    "price": 68000,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_269",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 52.7,
    "sizeM2": 174.072,
    "floor": 2,
    "totalFloors": 0,
    "price": 59900,
    "transactionDate": "2025-05",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_270",
    "name": "강변마을 월드메르디앙아파트",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 46.2,
    "sizeM2": 152.649,
    "floor": 13,
    "totalFloors": 0,
    "price": 69500,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 69500
      }
    ]
  },
  {
    "id": "LIVE_271",
    "name": "푸른마을(신안)",
    "district": "김포시",
    "neighborhood": "감정동",
    "size평": 54.9,
    "sizeM2": 181.545,
    "floor": 6,
    "totalFloors": 0,
    "price": 27000,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 27000
      },
      {
        "month": "2025-07",
        "price": 44000
      }
    ]
  },
  {
    "id": "LIVE_272",
    "name": "전원마을(월드4차2단지)",
    "district": "김포시",
    "neighborhood": "운양동",
    "size평": 49.9,
    "sizeM2": 164.97,
    "floor": 17,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 40000
      },
      {
        "month": "2025-10",
        "price": 37000
      }
    ]
  },
  {
    "id": "LIVE_273",
    "name": "풍무자이2단지",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 47.2,
    "sizeM2": 156.0857,
    "floor": 16,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 65000
      },
      {
        "month": "2025-06",
        "price": 60000
      },
      {
        "month": "2025-12",
        "price": 59500
      }
    ]
  },
  {
    "id": "LIVE_274",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 5,
    "totalFloors": 0,
    "price": 44000,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_275",
    "name": "청송마을(현대3)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 46.4,
    "sizeM2": 153.488,
    "floor": 2,
    "totalFloors": 0,
    "price": 54000,
    "transactionDate": "2025-04",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 54000
      },
      {
        "month": "2025-05",
        "price": 56750
      },
      {
        "month": "2025-09",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 55500
      },
      {
        "month": "2026-01",
        "price": 54000
      },
      {
        "month": "2026-02",
        "price": 54300
      }
    ]
  },
  {
    "id": "LIVE_276",
    "name": "장릉마을(삼성쉐르빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 57.2,
    "sizeM2": 189.22,
    "floor": 3,
    "totalFloors": 0,
    "price": 38000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 39000
      },
      {
        "month": "2025-11",
        "price": 39500
      },
      {
        "month": "2025-12",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_277",
    "name": "장릉마을(삼성쉐르빌)",
    "district": "김포시",
    "neighborhood": "풍무동",
    "size평": 57.2,
    "sizeM2": 189.22,
    "floor": 10,
    "totalFloors": 0,
    "price": 38000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 39000
      },
      {
        "month": "2025-11",
        "price": 39500
      },
      {
        "month": "2025-12",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_278",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 19,
    "totalFloors": 0,
    "price": 43400,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_279",
    "name": "풍년마을(삼성)",
    "district": "김포시",
    "neighborhood": "북변동",
    "size평": 45.1,
    "sizeM2": 149.22,
    "floor": 20,
    "totalFloors": 0,
    "price": 53000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 44000
      },
      {
        "month": "2025-05",
        "price": 45200
      },
      {
        "month": "2025-09",
        "price": 43800
      },
      {
        "month": "2026-01",
        "price": 43000
      }
    ]
  },
  {
    "id": "LIVE_280",
    "name": "수기마을힐스테이트2단지",
    "district": "김포시",
    "neighborhood": "고촌읍 신곡리",
    "size평": 46,
    "sizeM2": 152.07,
    "floor": 12,
    "totalFloors": 0,
    "price": 96000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2008,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 90000
      },
      {
        "month": "2026-01",
        "price": 87700
      }
    ]
  },
  {
    "id": "LIVE_281",
    "name": "오스타파라곤3단지",
    "district": "김포시",
    "neighborhood": "걸포동",
    "size평": 47.6,
    "sizeM2": 157.42,
    "floor": 11,
    "totalFloors": 0,
    "price": 75000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 75000
      },
      {
        "month": "2025-07",
        "price": 67000
      },
      {
        "month": "2025-08",
        "price": 80000
      },
      {
        "month": "2026-02",
        "price": 68500
      }
    ]
  },
  {
    "id": "LIVE_282",
    "name": "청송마을(현대2)",
    "district": "김포시",
    "neighborhood": "장기동",
    "size평": 62.3,
    "sizeM2": 205.854,
    "floor": 10,
    "totalFloors": 0,
    "price": 60000,
    "transactionDate": "2025-03",
    "lat": 37.6153,
    "lng": 126.7156,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 64780
      },
      {
        "month": "2025-06",
        "price": 64500
      },
      {
        "month": "2025-07",
        "price": 74375
      },
      {
        "month": "2025-10",
        "price": 74000
      },
      {
        "month": "2025-12",
        "price": 65000
      },
      {
        "month": "2026-01",
        "price": 59900
      }
    ]
  },
  {
    "id": "LIVE_283",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 59.9,
    "sizeM2": 197.9,
    "floor": 13,
    "totalFloors": 0,
    "price": 35000,
    "transactionDate": "2026-01",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_284",
    "name": "산내마을8단지월드메르디앙(114-37)",
    "district": "파주시",
    "neighborhood": "목동동",
    "size평": 53.8,
    "sizeM2": 177.945,
    "floor": 15,
    "totalFloors": 0,
    "price": 49800,
    "transactionDate": "2026-01",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 48000
      },
      {
        "month": "2026-01",
        "price": 49800
      }
    ]
  },
  {
    "id": "LIVE_285",
    "name": "산내마을8단지월드메르디앙(114-37)",
    "district": "파주시",
    "neighborhood": "목동동",
    "size평": 53.8,
    "sizeM2": 177.945,
    "floor": 7,
    "totalFloors": 0,
    "price": 48000,
    "transactionDate": "2025-11",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 48000
      },
      {
        "month": "2026-01",
        "price": 49800
      }
    ]
  },
  {
    "id": "LIVE_286",
    "name": "한라비발디(992-1)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 63.7,
    "sizeM2": 210.49,
    "floor": 9,
    "totalFloors": 0,
    "price": 33000,
    "transactionDate": "2025-11",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-11",
        "price": 33000
      }
    ]
  },
  {
    "id": "LIVE_287",
    "name": "한울마을2단지운정벽산블루밍아파트",
    "district": "파주시",
    "neighborhood": "동패동",
    "size평": 55.8,
    "sizeM2": 184.543,
    "floor": 3,
    "totalFloors": 0,
    "price": 50000,
    "transactionDate": "2025-10",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 50000
      }
    ]
  },
  {
    "id": "LIVE_288",
    "name": "한빛마을1단지한라비발디",
    "district": "파주시",
    "neighborhood": "야당동",
    "size평": 46.9,
    "sizeM2": 155.166,
    "floor": 26,
    "totalFloors": 0,
    "price": 65000,
    "transactionDate": "2025-10",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 73000
      },
      {
        "month": "2025-09",
        "price": 74000
      },
      {
        "month": "2025-10",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_289",
    "name": "파주푸르지오(269-0)",
    "district": "파주시",
    "neighborhood": "조리읍 봉일천리",
    "size평": 48,
    "sizeM2": 158.831,
    "floor": 1,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-10",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_290",
    "name": "신안실크밸리2차(900-0)",
    "district": "파주시",
    "neighborhood": "아동동",
    "size평": 46.3,
    "sizeM2": 153.0521,
    "floor": 15,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-09",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 39000
      },
      {
        "month": "2025-09",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_291",
    "name": "산내마을8단지월드메르디앙(114-37)",
    "district": "파주시",
    "neighborhood": "목동동",
    "size평": 53.8,
    "sizeM2": 177.945,
    "floor": 10,
    "totalFloors": 0,
    "price": 49250,
    "transactionDate": "2025-09",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-09",
        "price": 49250
      },
      {
        "month": "2025-11",
        "price": 48000
      },
      {
        "month": "2026-01",
        "price": 49800
      }
    ]
  },
  {
    "id": "LIVE_292",
    "name": "한빛마을1단지한라비발디",
    "district": "파주시",
    "neighborhood": "야당동",
    "size평": 46.9,
    "sizeM2": 155.166,
    "floor": 26,
    "totalFloors": 0,
    "price": 74000,
    "transactionDate": "2025-09",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 73000
      },
      {
        "month": "2025-09",
        "price": 74000
      },
      {
        "month": "2025-10",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_293",
    "name": "한울마을2단지운정벽산블루밍아파트",
    "district": "파주시",
    "neighborhood": "동패동",
    "size평": 55.8,
    "sizeM2": 184.543,
    "floor": 11,
    "totalFloors": 0,
    "price": 59000,
    "transactionDate": "2025-08",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 59000
      },
      {
        "month": "2025-10",
        "price": 50000
      }
    ]
  },
  {
    "id": "LIVE_294",
    "name": "신안실크밸리2차(900-0)",
    "district": "파주시",
    "neighborhood": "아동동",
    "size평": 46.3,
    "sizeM2": 153.0521,
    "floor": 6,
    "totalFloors": 0,
    "price": 39000,
    "transactionDate": "2025-06",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 39000
      },
      {
        "month": "2025-09",
        "price": 40000
      }
    ]
  },
  {
    "id": "LIVE_295",
    "name": "파주힐스테이트2차",
    "district": "파주시",
    "neighborhood": "문산읍 당동리",
    "size평": 45.3,
    "sizeM2": 149.6304,
    "floor": 8,
    "totalFloors": 0,
    "price": 41000,
    "transactionDate": "2025-06",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 41000
      }
    ]
  },
  {
    "id": "LIVE_296",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 59.9,
    "sizeM2": 197.9,
    "floor": 15,
    "totalFloors": 0,
    "price": 46500,
    "transactionDate": "2025-06",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_297",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 50.8,
    "sizeM2": 167.92,
    "floor": 7,
    "totalFloors": 0,
    "price": 34500,
    "transactionDate": "2025-06",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_298",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 59.9,
    "sizeM2": 197.9,
    "floor": 7,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-05",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_299",
    "name": "팜스프링(283-0)",
    "district": "파주시",
    "neighborhood": "아동동",
    "size평": 51.6,
    "sizeM2": 170.484,
    "floor": 6,
    "totalFloors": 0,
    "price": 30000,
    "transactionDate": "2025-04",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 30000
      }
    ]
  },
  {
    "id": "LIVE_300",
    "name": "한빛마을1단지한라비발디",
    "district": "파주시",
    "neighborhood": "야당동",
    "size평": 46.9,
    "sizeM2": 155.166,
    "floor": 19,
    "totalFloors": 0,
    "price": 73000,
    "transactionDate": "2025-04",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 73000
      },
      {
        "month": "2025-09",
        "price": 74000
      },
      {
        "month": "2025-10",
        "price": 65000
      }
    ]
  },
  {
    "id": "LIVE_301",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 59.9,
    "sizeM2": 197.9,
    "floor": 11,
    "totalFloors": 0,
    "price": 38200,
    "transactionDate": "2025-04",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_302",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 50.8,
    "sizeM2": 167.92,
    "floor": 5,
    "totalFloors": 0,
    "price": 38000,
    "transactionDate": "2025-04",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_303",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 50.8,
    "sizeM2": 167.92,
    "floor": 14,
    "totalFloors": 0,
    "price": 32500,
    "transactionDate": "2025-04",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_304",
    "name": "한라비발디(992-1)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 63.7,
    "sizeM2": 210.49,
    "floor": 8,
    "totalFloors": 0,
    "price": 34500,
    "transactionDate": "2025-03",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-11",
        "price": 33000
      }
    ]
  },
  {
    "id": "LIVE_305",
    "name": "그린시티동문(218-0)",
    "district": "파주시",
    "neighborhood": "조리읍 대원리",
    "size평": 50.8,
    "sizeM2": 167.92,
    "floor": 4,
    "totalFloors": 0,
    "price": 31000,
    "transactionDate": "2025-03",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 36233
      },
      {
        "month": "2025-05",
        "price": 38750
      },
      {
        "month": "2025-06",
        "price": 40500
      },
      {
        "month": "2026-01",
        "price": 35000
      }
    ]
  },
  {
    "id": "LIVE_306",
    "name": "팜스프링(283-0)",
    "district": "파주시",
    "neighborhood": "아동동",
    "size평": 51.6,
    "sizeM2": 170.484,
    "floor": 14,
    "totalFloors": 0,
    "price": 37500,
    "transactionDate": "2025-03",
    "lat": 37.8601,
    "lng": 126.7874,
    "buildYear": 2001,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 30000
      }
    ]
  },
  {
    "id": "LIVE_307",
    "name": "해동마을신도브래뉴",
    "district": "양주시",
    "neighborhood": "광사동",
    "size평": 48.3,
    "sizeM2": 159.6214,
    "floor": 7,
    "totalFloors": 0,
    "price": 50000,
    "transactionDate": "2025-08",
    "lat": 37.7851,
    "lng": 127.0456,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-08",
        "price": 50000
      }
    ]
  },
  {
    "id": "LIVE_308",
    "name": "현진에버빌",
    "district": "동두천시",
    "neighborhood": "지행동",
    "size평": 49.8,
    "sizeM2": 164.59,
    "floor": 13,
    "totalFloors": 0,
    "price": 44000,
    "transactionDate": "2025-05",
    "lat": 37.9035,
    "lng": 127.0601,
    "buildYear": 2005,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 44000
      }
    ]
  },
  {
    "id": "LIVE_309",
    "name": "휴먼빌아파트",
    "district": "동두천시",
    "neighborhood": "지행동",
    "size평": 45.1,
    "sizeM2": 148.9336,
    "floor": 13,
    "totalFloors": 0,
    "price": 50000,
    "transactionDate": "2025-04",
    "lat": 37.9035,
    "lng": 127.0601,
    "buildYear": 2009,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 50000
      }
    ]
  },
  {
    "id": "LIVE_310",
    "name": "쌍령현대1차모닝사이드",
    "district": "광주시",
    "neighborhood": "쌍령동",
    "size평": 45.4,
    "sizeM2": 149.953,
    "floor": 9,
    "totalFloors": 0,
    "price": 34000,
    "transactionDate": "2026-02",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 37000
      },
      {
        "month": "2025-05",
        "price": 40000
      },
      {
        "month": "2025-07",
        "price": 38500
      },
      {
        "month": "2025-12",
        "price": 40800
      },
      {
        "month": "2026-02",
        "price": 34000
      }
    ]
  },
  {
    "id": "LIVE_311",
    "name": "태전동우림필유",
    "district": "광주시",
    "neighborhood": "태전동",
    "size평": 50.1,
    "sizeM2": 165.562,
    "floor": 17,
    "totalFloors": 0,
    "price": 86000,
    "transactionDate": "2026-02",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2026-02",
        "price": 86000
      }
    ]
  },
  {
    "id": "LIVE_312",
    "name": "코아루햇빛마을",
    "district": "광주시",
    "neighborhood": "초월읍 산이리",
    "size평": 51.4,
    "sizeM2": 170.06,
    "floor": 14,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 43500
      },
      {
        "month": "2026-01",
        "price": 39333
      }
    ]
  },
  {
    "id": "LIVE_313",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 6,
    "totalFloors": 0,
    "price": 85500,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_314",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 8,
    "totalFloors": 0,
    "price": 87000,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_315",
    "name": "코아루햇빛마을",
    "district": "광주시",
    "neighborhood": "초월읍 산이리",
    "size평": 51.4,
    "sizeM2": 170.06,
    "floor": 7,
    "totalFloors": 0,
    "price": 38000,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 43500
      },
      {
        "month": "2026-01",
        "price": 39333
      }
    ]
  },
  {
    "id": "LIVE_316",
    "name": "양벌리우림",
    "district": "광주시",
    "neighborhood": "양벌동",
    "size평": 58.4,
    "sizeM2": 192.95,
    "floor": 5,
    "totalFloors": 0,
    "price": 48500,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 43000
      },
      {
        "month": "2026-01",
        "price": 48500
      }
    ]
  },
  {
    "id": "LIVE_317",
    "name": "현대모닝사이드1-B",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 8,
    "totalFloors": 0,
    "price": 73000,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2026-01",
        "price": 73000
      }
    ]
  },
  {
    "id": "LIVE_318",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 13,
    "totalFloors": 0,
    "price": 83000,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_319",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 10,
    "totalFloors": 0,
    "price": 61300,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_320",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.9,
    "sizeM2": 161.773,
    "floor": 11,
    "totalFloors": 0,
    "price": 69900,
    "transactionDate": "2026-01",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_321",
    "name": "쌍령현대1차모닝사이드",
    "district": "광주시",
    "neighborhood": "쌍령동",
    "size평": 45.4,
    "sizeM2": 149.953,
    "floor": 12,
    "totalFloors": 0,
    "price": 40800,
    "transactionDate": "2025-12",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 37000
      },
      {
        "month": "2025-05",
        "price": 40000
      },
      {
        "month": "2025-07",
        "price": 38500
      },
      {
        "month": "2025-12",
        "price": 40800
      },
      {
        "month": "2026-02",
        "price": 34000
      }
    ]
  },
  {
    "id": "LIVE_322",
    "name": "경남아너스빌2단지",
    "district": "광주시",
    "neighborhood": "탄벌동",
    "size평": 48.4,
    "sizeM2": 159.944,
    "floor": 12,
    "totalFloors": 0,
    "price": 61000,
    "transactionDate": "2025-12",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2011,
    "priceHistory": [
      {
        "month": "2025-12",
        "price": 61000
      }
    ]
  },
  {
    "id": "LIVE_323",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 47.9,
    "sizeM2": 158.3829,
    "floor": 10,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2025-12",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_324",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 14,
    "totalFloors": 0,
    "price": 73000,
    "transactionDate": "2025-12",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_325",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 7,
    "totalFloors": 0,
    "price": 64800,
    "transactionDate": "2025-10",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_326",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.9,
    "sizeM2": 161.773,
    "floor": 4,
    "totalFloors": 0,
    "price": 61000,
    "transactionDate": "2025-10",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_327",
    "name": "코아루햇빛마을",
    "district": "광주시",
    "neighborhood": "초월읍 산이리",
    "size평": 51.4,
    "sizeM2": 170.06,
    "floor": 3,
    "totalFloors": 0,
    "price": 43500,
    "transactionDate": "2025-10",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-10",
        "price": 43500
      },
      {
        "month": "2026-01",
        "price": 39333
      }
    ]
  },
  {
    "id": "LIVE_328",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 3,
    "totalFloors": 0,
    "price": 82000,
    "transactionDate": "2025-10",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_329",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 8,
    "totalFloors": 0,
    "price": 84000,
    "transactionDate": "2025-08",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_330",
    "name": "쌍령현대1차모닝사이드",
    "district": "광주시",
    "neighborhood": "쌍령동",
    "size평": 45.4,
    "sizeM2": 149.953,
    "floor": 4,
    "totalFloors": 0,
    "price": 38500,
    "transactionDate": "2025-07",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 37000
      },
      {
        "month": "2025-05",
        "price": 40000
      },
      {
        "month": "2025-07",
        "price": 38500
      },
      {
        "month": "2025-12",
        "price": 40800
      },
      {
        "month": "2026-02",
        "price": 34000
      }
    ]
  },
  {
    "id": "LIVE_331",
    "name": "벽산블루밍2단지",
    "district": "광주시",
    "neighborhood": "탄벌동",
    "size평": 45.3,
    "sizeM2": 149.8,
    "floor": 4,
    "totalFloors": 0,
    "price": 56500,
    "transactionDate": "2025-06",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2011,
    "priceHistory": [
      {
        "month": "2025-06",
        "price": 56500
      }
    ]
  },
  {
    "id": "LIVE_332",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 47.9,
    "sizeM2": 158.3829,
    "floor": 6,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2025-06",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_333",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 1,
    "totalFloors": 0,
    "price": 77500,
    "transactionDate": "2025-06",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_334",
    "name": "신일해피트리",
    "district": "광주시",
    "neighborhood": "초월읍 도평리",
    "size평": 49.8,
    "sizeM2": 164.68,
    "floor": 4,
    "totalFloors": 0,
    "price": 36000,
    "transactionDate": "2025-06",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 36000
      }
    ]
  },
  {
    "id": "LIVE_335",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 47.9,
    "sizeM2": 158.3829,
    "floor": 7,
    "totalFloors": 0,
    "price": 83500,
    "transactionDate": "2025-06",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_336",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 11,
    "totalFloors": 0,
    "price": 79000,
    "transactionDate": "2025-05",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_337",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 7,
    "totalFloors": 0,
    "price": 84500,
    "transactionDate": "2025-05",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_338",
    "name": "쌍령현대1차모닝사이드",
    "district": "광주시",
    "neighborhood": "쌍령동",
    "size평": 45.4,
    "sizeM2": 149.953,
    "floor": 3,
    "totalFloors": 0,
    "price": 40000,
    "transactionDate": "2025-05",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 37000
      },
      {
        "month": "2025-05",
        "price": 40000
      },
      {
        "month": "2025-07",
        "price": 38500
      },
      {
        "month": "2025-12",
        "price": 40800
      },
      {
        "month": "2026-02",
        "price": 34000
      }
    ]
  },
  {
    "id": "LIVE_339",
    "name": "양벌리우림",
    "district": "광주시",
    "neighborhood": "양벌동",
    "size평": 58.4,
    "sizeM2": 192.95,
    "floor": 11,
    "totalFloors": 0,
    "price": 43000,
    "transactionDate": "2025-05",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 43000
      },
      {
        "month": "2026-01",
        "price": 48500
      }
    ]
  },
  {
    "id": "LIVE_340",
    "name": "오포e편한세상",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.7,
    "sizeM2": 160.8298,
    "floor": 6,
    "totalFloors": 0,
    "price": 85000,
    "transactionDate": "2025-05",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2010,
    "priceHistory": [
      {
        "month": "2025-05",
        "price": 84750
      },
      {
        "month": "2025-06",
        "price": 82000
      },
      {
        "month": "2025-08",
        "price": 84000
      },
      {
        "month": "2025-10",
        "price": 82000
      },
      {
        "month": "2025-12",
        "price": 79000
      },
      {
        "month": "2026-01",
        "price": 85167
      }
    ]
  },
  {
    "id": "LIVE_341",
    "name": "현대",
    "district": "광주시",
    "neighborhood": "탄벌동",
    "size평": 53.3,
    "sizeM2": 176.217,
    "floor": 6,
    "totalFloors": 0,
    "price": 51500,
    "transactionDate": "2025-04",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 51500
      }
    ]
  },
  {
    "id": "LIVE_342",
    "name": "쌍령현대1차모닝사이드",
    "district": "광주시",
    "neighborhood": "쌍령동",
    "size평": 45.4,
    "sizeM2": 149.953,
    "floor": 7,
    "totalFloors": 0,
    "price": 37000,
    "transactionDate": "2025-04",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 37000
      },
      {
        "month": "2025-05",
        "price": 40000
      },
      {
        "month": "2025-07",
        "price": 38500
      },
      {
        "month": "2025-12",
        "price": 40800
      },
      {
        "month": "2026-02",
        "price": 34000
      }
    ]
  },
  {
    "id": "LIVE_343",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 5,
    "totalFloors": 0,
    "price": 63000,
    "transactionDate": "2025-04",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_344",
    "name": "신일해피트리",
    "district": "광주시",
    "neighborhood": "초월읍 도평리",
    "size평": 49.8,
    "sizeM2": 164.68,
    "floor": 11,
    "totalFloors": 0,
    "price": 34000,
    "transactionDate": "2025-04",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 34000
      },
      {
        "month": "2025-06",
        "price": 36000
      }
    ]
  },
  {
    "id": "LIVE_345",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 45.5,
    "sizeM2": 150.455,
    "floor": 11,
    "totalFloors": 0,
    "price": 80000,
    "transactionDate": "2025-03",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
  },
  {
    "id": "LIVE_346",
    "name": "현대",
    "district": "광주시",
    "neighborhood": "탄벌동",
    "size평": 53.3,
    "sizeM2": 176.217,
    "floor": 8,
    "totalFloors": 0,
    "price": 58000,
    "transactionDate": "2025-03",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2000,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 51500
      }
    ]
  },
  {
    "id": "LIVE_347",
    "name": "현대모닝사이드1-A",
    "district": "광주시",
    "neighborhood": "신현동",
    "size평": 48.9,
    "sizeM2": 161.773,
    "floor": 14,
    "totalFloors": 0,
    "price": 59000,
    "transactionDate": "2025-03",
    "lat": 37.4296,
    "lng": 127.2558,
    "buildYear": 2002,
    "priceHistory": [
      {
        "month": "2025-04",
        "price": 63000
      },
      {
        "month": "2025-05",
        "price": 79000
      },
      {
        "month": "2025-10",
        "price": 62900
      },
      {
        "month": "2026-01",
        "price": 65600
      }
    ]
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
