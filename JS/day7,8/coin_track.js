const API_URL = 'https://api4.binance.com/api/v3/ticker/24hr';

// 애플리케이션 상태 관리 Object
const state = {
    allTickerData: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    currentTab: 'all', // 'all' 또는 'favorites'
    searchQuery: ''
};

// DOM 요소 캐싱
const cryptoTbody = document.getElementById('crypto-tbody');
const searchInput = document.getElementById('search-input');
const tabAll = document.getElementById('tab-all');
const tabFav = document.getElementById('tab-fav');
const themeToggle = document.getElementById('theme-toggle');

// 1. API 데이터 요청 함수
async function fetchCryptoData() {
    try {
        // 로컬 file:// 실행에서의 CORS 오류 및 418 IP 밴(차단)을 회피하기 위해 fetch 시점에만 프록시 적용!
        const fetchUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(API_URL);
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('네트워크 응답 안정성 확인 필요');

        const rawData = await response.json();

        // USDT로 끝나는 마켓만 필터링하여 상태 업데이트
        state.allTickerData = rawData.filter(item => item.symbol.endsWith('USDT'));

        // 데이터 갱신 시 테이블 리렌더링
        renderTable();
    } catch (error) {
        console.error('데이터 호출 실패:', error);
        // 네트워크 에러 혹은 차단 시 테이블 내에 시각적인 에러 메시지 제공
        if (state.allTickerData.length === 0) {
            cryptoTbody.innerHTML = `<tr><td colspan="6" style="color: var(--color-positive); padding: 40px 0; font-weight: 600; line-height: 1.6;">데이터를 가져오는 데 실패했습니다.<br><span style="font-size: 13px; font-weight: normal; color: var(--text-muted);">임시로 네트워크 지연이 있거나 바이낸스 API 호출이 제한(Rate Limit)되었을 수 있습니다. 잠시 후 다시 시도합니다.</span></td></tr>`;
        }
    }
}

// 2. 가독성을 위한 숫자 포맷터 함수
function formatPrice(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // 값이 1 미만인 경우 소수점 자릿수 유지, 크면 천단위 콤마 추가
    return num >= 1 ? num.toLocaleString(undefined, { maximumFractionDigits: 4 }) : num.toString();
}

// 3. 화면 렌더링 함수
function renderTable() {
    cryptoTbody.innerHTML = '';

    // 조건에 따른 데이터 필터링 파이프라인
    let filteredList = state.allTickerData;

    // 탭 기준 필터링
    if (state.currentTab === 'favorites') {
        filteredList = filteredList.filter(item => state.favorites.includes(item.symbol));
    }

    // 검색어 기준 필터링
    if (state.searchQuery) {
        filteredList = filteredList.filter(item =>
            item.symbol.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }

    // 데이터가 비었을 때 예외 처리
    if (filteredList.length === 0) {
        cryptoTbody.innerHTML = `<tr><td colspan="6" style="color: #868e96; padding: 40px 0;">조회된 암호화폐가 없습니다.</td></tr>`;
        return;
    }

    // 테이블 행 생성 연산
    filteredList.forEach(item => {
        const isFavorite = state.favorites.includes(item.symbol);
        const changePercent = parseFloat(item.priceChangePercent);

        // 변동률 디자인 분기
        let changeClass = 'neutral';
        let prefix = '';
        if (changePercent > 0) {
            changeClass = 'positive';
            prefix = '+';
        } else if (changePercent < 0) {
            changeClass = 'negative';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="star-btn ${isFavorite ? 'fav' : ''}" data-symbol="${item.symbol}">
                    ${isFavorite ? '★' : '☆'}
                </span>
            </td>
            <td class="symbol-text">${item.symbol}</td>
            <td>${formatPrice(item.lastPrice)}</td>
            <td class="${changeClass}">${prefix}${changePercent.toFixed(2)}%</td>
            <td>${formatPrice(item.highPrice)}</td>
            <td>${formatPrice(item.lowPrice)}</td>
        `;
        cryptoTbody.appendChild(tr);
    });
}

// 4. 이벤트 리스너 설정
// 즐겨찾기 토글 (이벤트 위임 기법 적용)
cryptoTbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('star-btn')) {
        const symbol = e.target.getAttribute('data-symbol');
        const index = state.favorites.indexOf(symbol);

        if (index > -1) {
            state.favorites.splice(index, 1); // 제거
        } else {
            state.favorites.push(symbol); // 추가
        }

        // 로컬스토리지 동기화 및 즉시 리렌더링
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
        renderTable();
    }
});

// 검색 바 입력 이벤트
searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderTable();
});

// 전체보기 탭 전환
tabAll.addEventListener('click', () => {
    state.currentTab = 'all';
    tabAll.classList.add('active');
    tabFav.classList.remove('active');
    renderTable();
});

// 관심항목 탭 전환
tabFav.addEventListener('click', () => {
    state.currentTab = 'favorites';
    tabFav.classList.add('active');
    tabAll.classList.remove('active');
    renderTable();
});

// 5. 초기 실행 및 3초 주기 타이머 실행 (과부하 및 API 차단 방지)
cryptoTbody.innerHTML = `<tr><td colspan="6" style="color: var(--text-muted); padding: 40px 0;">실시간 데이터를 불러오는 중입니다...</td></tr>`;
fetchCryptoData();
setInterval(fetchCryptoData, 3000);

// 6. 테마 전환 및 저장 로직 (다크 모드)
function initTheme() {
    // window.matchMedia 미지원 구형 브라우저 및 특수 환경에서의 스크립트 정지 차단
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// 테마 초기화
initTheme();