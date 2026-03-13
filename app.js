/* ============================================================
   Seoul Large Apartment Price Tracker — app.js
   서울시청 40km 이내 · 45평 이상 · 15억 미만
   ============================================================ */

/* ============================================================
   State
   ============================================================ */
const state = {
  allData: [],
  filtered: [],
  sortKey: 'price',
  sortDir: 'desc',
  page: 0,
  pageSize: 15,
  searchQuery: '',
  chartMonths: 12,
  filters: {
    districts: [],          // 비어 있으면 전체
    minSize평: 45,
    maxSize평: 100,
    minPrice: 0,
    maxPrice: 149999        // 15억 미만 고정 상한
  },
  map: null,
  chart: null,
  markers: {},              // id → Leaflet marker
  selectedId: null
};

/* ============================================================
   Constants
   ============================================================ */
const SEOUL_LAT = 37.5665;
const SEOUL_LNG = 126.9780;
const MAX_RADIUS_KM = 40;
const MIN_SIZE_M2 = 148.76;
const MAX_PRICE = 149999;

/* ============================================================
   Utility Functions
   ============================================================ */

/** 원/만원 포매터 */
function formatPrice(manwon) {
  if (!manwon || isNaN(manwon)) return '—';
  const eok = Math.floor(manwon / 10000);
  const man = manwon % 10000;
  if (eok > 0 && man > 0) {
    return `${eok}억 ${man.toLocaleString()}만`;
  } else if (eok > 0) {
    return `${eok}억`;
  } else {
    return `${man.toLocaleString()}만`;
  }
}

/** 면적 포매터 */
function formatSize(size평, sizeM2) {
  return `${size평}평 (${sizeM2.toFixed(1)}㎡)`;
}

/** Haversine 거리 계산 (km) */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
          + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
          * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 최근 N개월 YYYY-MM 배열 */
function getLastNMonths(n) {
  const result = [];
  const base = new Date(2026, 2, 1);
  for (let i = n; i >= 1; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    result.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  }
  return result;
}

/** 가격 티어 */
function getPriceTier(price) {
  if (price < 50000) return 'low';
  if (price < 70000) return 'mid';
  return 'high';
}

/** 티어별 마커 색상 */
const TIER_COLOR = {
  low:  '#2563eb',
  mid:  '#10b981',
  high: '#f59e0b'
};

/** SVG 스파크라인 생성 */
function sparklineSVG(history) {
  if (!history || history.length < 2) return '<span style="color:#cbd5e1">—</span>';
  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const W = 80, H = 28, PAD = 3;
  const pts = prices.map((p, i) => {
    const x = PAD + (i / (prices.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((p - min) / range) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const lastTwo = prices.slice(-2);
  const color = lastTwo[1] > lastTwo[0] ? '#ef4444' : lastTwo[1] < lastTwo[0] ? '#10b981' : '#94a3b8';

  return `<svg class="sparkline" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${pts.split(' ').at(-1).split(',')[0]}" cy="${pts.split(' ').at(-1).split(',')[1]}" r="2.5" fill="${color}"/>
  </svg>`;
}

/** 추세 아이콘 */
function trendIcon(history) {
  if (!history || history.length < 2) return '';
  const last = history.at(-1).price;
  const prev = history.at(-2).price;
  if (last > prev) return '<span class="trend-up">▲</span>';
  if (last < prev) return '<span class="trend-down">▼</span>';
  return '<span class="trend-flat">—</span>';
}

/* ============================================================
   Filter & Sort
   ============================================================ */
function applyFilters() {
  const { districts, minSize평, maxSize평, minPrice, maxPrice } = state.filters;
  const q = state.searchQuery.toLowerCase();

  state.filtered = state.allData.filter(apt => {
    // 45평 이상 고정
    if (apt.sizeM2 < MIN_SIZE_M2) return false;
    // 10억 미만 고정
    if (apt.price >= MAX_PRICE) return false;
    // Haversine 40km 이내
    if (apt.lat && apt.lng) {
      const dist = haversine(SEOUL_LAT, SEOUL_LNG, apt.lat, apt.lng);
      if (dist > MAX_RADIUS_KM) return false;
    }
    // 지역 필터
    if (districts.length > 0 && !districts.some(d => apt.district.includes(d))) return false;
    // 평수 필터
    if (apt.size평 < minSize평 || apt.size평 > maxSize평) return false;
    // 가격 필터
    if (apt.price < minPrice || apt.price > maxPrice) return false;
    // 검색
    if (q && !apt.name.toLowerCase().includes(q) && !apt.district.toLowerCase().includes(q)) return false;
    return true;
  });

  // 정렬
  state.filtered.sort((a, b) => {
    let va = a[state.sortKey] ?? '';
    let vb = b[state.sortKey] ?? '';
    if (typeof va === 'string') va = va.localeCompare(vb);
    else va = va - vb;
    return state.sortDir === 'asc' ? va : -va;
  });

  state.page = 0;
  render();
}

/* ============================================================
   Render: Stat Cards
   ============================================================ */
function updateStatCards() {
  const data = state.filtered;
  if (data.length === 0) {
    document.getElementById('stat-avg').textContent = '—';
    document.getElementById('stat-max').textContent = '—';
    document.getElementById('stat-min').textContent = '—';
    document.getElementById('stat-count').textContent = '0건';
    return;
  }
  const prices = data.map(d => d.price);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length / 100) * 100;
  document.getElementById('stat-avg').textContent = formatPrice(avg);
  document.getElementById('stat-max').textContent = formatPrice(Math.max(...prices));
  document.getElementById('stat-min').textContent = formatPrice(Math.min(...prices));
  document.getElementById('stat-count').textContent = data.length + '건';
}

/* ============================================================
   Render: Map
   ============================================================ */
function initMap() {
  state.map = L.map('map', { tap: false }).setView([SEOUL_LAT, SEOUL_LNG], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(state.map);

  // 서울시청 마커
  L.marker([SEOUL_LAT, SEOUL_LNG], {
    icon: L.divIcon({
      className: '',
      html: '<div style="background:#1a3a5c;color:#fff;font-size:10px;padding:3px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,.3)">🏛️ 서울시청</div>',
      iconAnchor: [40, 10]
    })
  }).addTo(state.map);

  // 40km 반경 원
  L.circle([SEOUL_LAT, SEOUL_LNG], {
    radius: MAX_RADIUS_KM * 1000,
    color: '#2563eb',
    weight: 1.5,
    fillOpacity: 0.03,
    dashArray: '6 4'
  }).addTo(state.map);
}

function renderMap() {
  // 기존 마커 제거
  Object.values(state.markers).forEach(m => state.map.removeLayer(m));
  state.markers = {};

  state.filtered.forEach(apt => {
    if (!apt.lat || !apt.lng) return;

    const tier = getPriceTier(apt.price);
    const color = TIER_COLOR[tier];

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        background:${color};border:2.5px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,.3);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);font-size:9px;font-weight:700;color:#fff;">
          ${Math.round(apt.price / 10000)}억
        </span>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    const trend = apt.priceHistory && apt.priceHistory.length >= 2
      ? (apt.priceHistory.at(-1).price > apt.priceHistory.at(-2).price ? '▲ 상승' : '▼ 하락')
      : '';

    const popup = L.popup({ maxWidth: 220 }).setContent(`
      <div class="popup-content">
        <div class="popup-name">${apt.name}</div>
        <div class="popup-price">${formatPrice(apt.price)}</div>
        <div class="popup-detail">
          📍 ${apt.district} ${apt.neighborhood}<br>
          📐 ${formatSize(apt.size평, apt.sizeM2)}<br>
          🏢 ${apt.floor}층 / ${apt.totalFloors || '—'}층<br>
          📅 ${apt.transactionDate}${trend ? ' · ' + trend : ''}
        </div>
      </div>
    `);

    const marker = L.marker([apt.lat, apt.lng], { icon })
      .bindPopup(popup)
      .on('click', () => {
        highlightRow(apt.id);
      })
      .addTo(state.map);

    state.markers[apt.id] = marker;
  });
}

function flyToApt(apt) {
  if (!apt.lat || !apt.lng) return;
  state.map.flyTo([apt.lat, apt.lng], 14, { duration: 0.8 });
  const marker = state.markers[apt.id];
  if (marker) setTimeout(() => marker.openPopup(), 850);
}

/* ============================================================
   Render: Chart
   ============================================================ */
function initChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  state.chart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '  평균가: ' + formatPrice(Math.round(ctx.raw))
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: "'Pretendard Variable', sans-serif", size: 11 } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { family: "'Pretendard Variable', sans-serif", size: 11 },
            callback: val => {
              if (val >= 10000) return (val / 10000).toFixed(1) + '억';
              return val.toLocaleString() + '만';
            }
          }
        }
      }
    }
  });
}

function renderChart() {
  const months = getLastNMonths(state.chartMonths);
  const avgByMonth = {};

  months.forEach(m => { avgByMonth[m] = { sum: 0, count: 0 }; });

  state.filtered.forEach(apt => {
    if (!apt.priceHistory) return;
    apt.priceHistory.forEach(h => {
      if (avgByMonth[h.month] !== undefined) {
        avgByMonth[h.month].sum += h.price;
        avgByMonth[h.month].count++;
      }
    });
  });

  const labels = months;
  const data = months.map(m => {
    const e = avgByMonth[m];
    return e && e.count > 0 ? Math.round(e.sum / e.count) : null;
  });

  state.chart.data.labels = labels;
  state.chart.data.datasets = [{
    label: '평균 거래가',
    data,
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37,99,235,.08)',
    borderWidth: 2.5,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 7,
    pointBackgroundColor: '#2563eb',
    spanGaps: true
  }];
  state.chart.update();

  document.getElementById('chartNote').textContent =
    `필터된 ${state.filtered.length}건 기준 · 최근 ${state.chartMonths}개월`;
}

/* ============================================================
   Render: Table
   ============================================================ */
function renderTable() {
  const start = state.page * state.pageSize;
  const pageData = state.filtered.slice(start, start + state.pageSize);

  document.getElementById('tableCount').textContent = state.filtered.length + '건';

  const tbody = document.getElementById('tableBody');

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>조건에 맞는 아파트가 없습니다.</p>
      </div>
    </td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = pageData.map(apt => {
    const tier = getPriceTier(apt.price);
    const isSelected = apt.id === state.selectedId;
    return `
      <tr data-id="${apt.id}" class="${isSelected ? 'highlighted' : ''}">
        <td data-label="아파트명">
          <strong>${apt.name}</strong>
          <div style="font-size:.75rem;color:#94a3b8;margin-top:1px;">${apt.neighborhood}</div>
        </td>
        <td data-label="지역"><span class="district-tag">${apt.district}</span></td>
        <td data-label="면적" class="size-cell">${apt.size평}평<br>${apt.sizeM2.toFixed(1)}㎡</td>
        <td data-label="층">${apt.floor}층</td>
        <td data-label="거래금액" class="price-cell price-tier-${tier}">${formatPrice(apt.price)}</td>
        <td data-label="거래일" style="color:#64748b">${apt.transactionDate}</td>
        <td data-label="추세">${sparklineSVG(apt.priceHistory)}${trendIcon(apt.priceHistory)}</td>
      </tr>
    `;
  }).join('');

  // Row click → fly to map
  tbody.querySelectorAll('tr[data-id]').forEach(tr => {
    tr.addEventListener('click', () => {
      const apt = state.allData.find(a => a.id === tr.dataset.id);
      if (!apt) return;
      state.selectedId = apt.id;
      flyToApt(apt);
      renderTable();
    });
  });

  renderPagination();
}

/* ============================================================
   Render: Pagination
   ============================================================ */
function renderPagination() {
  const total = Math.ceil(state.filtered.length / state.pageSize);
  const pg = document.getElementById('pagination');

  if (total <= 1) { pg.innerHTML = ''; return; }

  let html = '';
  html += `<button class="page-btn" ${state.page === 0 ? 'disabled' : ''} data-page="${state.page - 1}">‹</button>`;

  for (let i = 0; i < total; i++) {
    if (total > 7 && Math.abs(i - state.page) > 2 && i !== 0 && i !== total - 1) {
      if (i === 1 || i === total - 2) html += `<span style="padding:0 4px;color:#94a3b8">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${i === state.page ? 'active' : ''}" data-page="${i}">${i + 1}</button>`;
  }

  html += `<button class="page-btn" ${state.page === total - 1 ? 'disabled' : ''} data-page="${state.page + 1}">›</button>`;
  pg.innerHTML = html;

  pg.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      state.page = parseInt(btn.dataset.page);
      renderTable();
      document.getElementById('apartmentTable').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   Render: All
   ============================================================ */
function render() {
  updateStatCards();
  renderMap();
  renderChart();
  renderTable();
}

/* ============================================================
   Highlight Row
   ============================================================ */
function highlightRow(id) {
  state.selectedId = id;

  // Find page containing this record
  const idx = state.filtered.findIndex(a => a.id === id);
  if (idx >= 0) {
    state.page = Math.floor(idx / state.pageSize);
  }
  renderTable();
}

/* ============================================================
   Build Filter UI
   ============================================================ */
function buildFilterUI() {
  // Collect unique districts
  const districtSet = new Set(state.allData.map(a => a.district));
  const districts = [...districtSet].sort();
  state.filters.districts = [...districts]; // 초기엔 전체 선택

  const container = document.getElementById('districtList');
  container.innerHTML = districts.map(d => `
    <label class="district-item">
      <input type="checkbox" checked value="${d}" data-district>
      <span>${d}</span>
    </label>
  `).join('');

  container.addEventListener('change', () => {
    const checked = [...container.querySelectorAll('[data-district]:checked')].map(el => el.value);
    state.filters.districts = checked;
    applyFilters();
  });

  // Range sliders
  const sliderMinSize  = document.getElementById('sliderMinSize');
  const sliderMaxSize  = document.getElementById('sliderMaxSize');
  const sliderMinPrice = document.getElementById('sliderMinPrice');
  const sliderMaxPrice = document.getElementById('sliderMaxPrice');
  const labelMinSize   = document.getElementById('labelMinSize');
  const labelMaxSize   = document.getElementById('labelMaxSize');
  const labelMinPrice  = document.getElementById('labelMinPrice');
  const labelMaxPrice  = document.getElementById('labelMaxPrice');

  function updateSizeLabels() {
    let min = parseInt(sliderMinSize.value);
    let max = parseInt(sliderMaxSize.value);
    if (min > max) { sliderMinSize.value = max; min = max; }
    labelMinSize.textContent  = min + '평';
    labelMaxSize.textContent  = max >= 100 ? '100평+' : max + '평';
    state.filters.minSize평   = min;
    state.filters.maxSize평   = max;
    applyFilters();
  }

  function updatePriceLabels() {
    let min = parseInt(sliderMinPrice.value);
    let max = parseInt(sliderMaxPrice.value);
    if (min > max) { sliderMinPrice.value = max; min = max; }
    labelMinPrice.textContent = formatPrice(min) || '0만';
    labelMaxPrice.textContent = max >= 149999 ? '15억 미만' : formatPrice(max);
    state.filters.minPrice    = min;
    state.filters.maxPrice    = max;
    applyFilters();
  }

  sliderMinSize.addEventListener('input', updateSizeLabels);
  sliderMaxSize.addEventListener('input', updateSizeLabels);
  sliderMinPrice.addEventListener('input', updatePriceLabels);
  sliderMaxPrice.addEventListener('input', updatePriceLabels);

  // Reset button
  document.getElementById('btnReset').addEventListener('click', () => {
    sliderMinSize.value  = 45;  sliderMaxSize.value  = 100;
    sliderMinPrice.value = 0;   sliderMaxPrice.value = 149999;
    updateSizeLabels(); updatePriceLabels();
    state.searchQuery = '';
    document.getElementById('searchInput').value = '';
    container.querySelectorAll('[data-district]').forEach(el => el.checked = true);
    state.filters.districts = [...districts];
    applyFilters();
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', e => {
    state.searchQuery = e.target.value.trim();
    applyFilters();
  });

  // Table sort
  document.querySelectorAll('thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDir = 'desc';
      }
      document.querySelectorAll('thead th').forEach(t => {
        t.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      applyFilters();
    });
  });

  // Set initial sort indicator
  const priceHeader = document.querySelector('thead th[data-sort="price"]');
  if (priceHeader) priceHeader.classList.add('sort-desc');
}

/* ============================================================
   Init
   ============================================================ */
async function init() {
  // Show loading
  document.getElementById('tableBody').innerHTML =
    '<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">⏳</div><p>데이터 로딩 중...</p></div></td></tr>';

  try {
    state.allData = await window.DataModule.getDataSource();
  } catch (e) {
    state.allData = window.DataModule.SAMPLE_DATA;
    console.warn('데이터 로드 실패, 샘플 데이터 사용:', e);
  }

  const lastUpdated = window.DataModule.LAST_UPDATED || '-';
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) lastUpdatedEl.textContent = lastUpdated;
  const statUpdatedEl = document.getElementById('stat-updated');
  if (statUpdatedEl) statUpdatedEl.textContent = lastUpdated;

  initMap();
  initChart();
  buildFilterUI();
  applyFilters();
}

document.addEventListener('DOMContentLoaded', init);
