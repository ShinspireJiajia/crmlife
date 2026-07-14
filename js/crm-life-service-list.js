/* ============================================
   鄰里生活服務專區 — 完整清單頁面邏輯
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     商家服務資料
     ------------------------------------------ */
  var serviceData = {
    hoho: {
      name: 'HoHo 居家打掃',
      tagline: '讓家更有溫度的清潔專家',
      img: 'assets/service5.jpg',
      promo: '本月預約清潔服務即享 85 折優惠，並贈送天然精油空間噴霧乙次。',
      services: [
        { value: '2hrs', name: '專業清潔服務 2HRS', price: '$2,200' },
        { value: '4hrs', name: '專業清潔服務 4HRS', price: '$3,800' },
        { value: 'other', name: '其他特殊清潔需求', price: '現場評估', isEstimate: true }
      ],
      placeholder: '例如：有養寵物、需加強廚房清潔...'
    },
    senn: {
      name: '森覺鍋物 Senn shabu',
      tagline: '精緻鍋物、暖心美味',
      img: 'assets/service4.jpg',
      promo: '住戶用餐贈送精緻肉盤乙份，每桌限用一次。',
      services: [
        { value: 'double', name: '雙人精緻套餐', price: '$1,680' },
        { value: 'family', name: '四人豪華套餐', price: '$3,200' },
        { value: 'single', name: '單人商業午餐', price: '$580' }
      ],
      placeholder: '例如：忌口食材、特殊需求...'
    },
    studio: {
      name: 'THE STUDIO 藝術私廚',
      tagline: '藝術與美食的完美邂逅',
      img: 'assets/service1.jpg',
      promo: '住戶消費滿 $2,000 即折 $100，不限次數。',
      services: [
        { value: 'double', name: '雙人精選套餐', price: '$2,800' },
        { value: 'family', name: '四人分享套餐', price: '$4,500' },
        { value: 'single', name: '主廚特製單人餐', price: '$980' }
      ],
      placeholder: '例如：過敏食材、慶祝場合...'
    },
    pet: {
      name: '百香狗寵物美容',
      tagline: '毛小孩的頂級呵護專家',
      img: 'assets/service2.jpg',
      promo: '住戶消費滿 $500 享 9 折優惠，可與其他優惠併用。',
      services: [
        { value: 'basic', name: '基礎洗澡美容', price: '$800' },
        { value: 'full', name: '全套造型美容', price: '$1,500' },
        { value: 'spa', name: 'SPA 養護套餐', price: '$2,200' }
      ],
      placeholder: '例如：寵物品種、體型大小、特殊注意事項...'
    },
    sparkle: {
      name: 'Sparkle 汽車美容',
      tagline: '愛車煥然一新',
      img: 'assets/service3.jpg',
      promo: '住戶首次洗車享免費內裝除塵。',
      services: [
        { value: 'wash', name: '精緻手工洗車', price: '$500' },
        { value: 'coating', name: '鍍膜護理套餐', price: '$3,600' },
        { value: 'full', name: '全車深層美容', price: '$6,800' }
      ],
      placeholder: '例如：車型、特殊需求...'
    },
    carshine: {
      name: '卡爾車體護理',
      tagline: '專業車體美容 到府服務',
      img: 'assets/service3.jpg',
      promo: '住戶到府洗車享 9 折，兩台以上再折 $100。',
      services: [
        { value: 'basic', name: '基礎外觀清洗', price: '$400' },
        { value: 'interior', name: '內裝深層清潔', price: '$1,200' },
        { value: 'premium', name: '尊榮全車護理', price: '$5,500' }
      ],
      placeholder: '例如：車輛停放位置、偏好時段...'
    },
    brunch: {
      name: '晨光早午餐',
      tagline: '用美味喚醒每一天',
      img: 'assets/service1.jpg',
      promo: '住戶出示會員頁面享飲品免費升級。',
      services: [
        { value: 'setA', name: '經典早午餐 A 套餐', price: '$280' },
        { value: 'setB', name: '豪華早午餐 B 套餐', price: '$380' },
        { value: 'drink', name: '手沖單品咖啡', price: '$120' }
      ],
      placeholder: '例如：用餐人數、座位偏好...'
    },
    yoga: {
      name: '靜心瑜伽工作室',
      tagline: '身心平衡的美好時光',
      img: 'assets/service2.jpg',
      promo: '住戶首堂體驗免費，購買課程包享 85 折。',
      services: [
        { value: 'trial', name: '單堂體驗課', price: '免費' },
        { value: 'pack10', name: '十堂課程包', price: '$4,500' },
        { value: 'private', name: '一對一私人課', price: '$1,200' }
      ],
      placeholder: '例如：偏好時段、身體狀況...'
    },
    laundry: {
      name: '速潔洗衣到府收送',
      tagline: '專業送洗 隔日取件',
      img: 'assets/service5.jpg',
      promo: '住戶滿 3 件 9 折，大型寢具免運費。',
      services: [
        { value: 'normal', name: '一般衣物清洗（每件）', price: '$80' },
        { value: 'dry', name: '精緻乾洗（每件）', price: '$250' },
        { value: 'bedding', name: '大型寢具清洗', price: '$600' }
      ],
      placeholder: '例如：衣物數量、特殊材質...'
    },
    dessert: {
      name: '日和甜點工房',
      tagline: '手工甜點 療癒每一刻',
      img: 'assets/service4.jpg',
      promo: '住戶訂購蛋糕享免費配送到府。',
      services: [
        { value: 'cake6', name: '6 吋手工蛋糕', price: '$680' },
        { value: 'cake8', name: '8 吋手工蛋糕', price: '$980' },
        { value: 'box', name: '精選禮盒（12 入）', price: '$520' }
      ],
      placeholder: '例如：口味偏好、過敏原...'
    }
  };

  /* ------------------------------------------
     DOM 元素參照
     ------------------------------------------ */
  var tabsContainer = document.getElementById('lifeServiceTabs');
  var gridContainer = document.getElementById('lifeServiceGrid');
  var searchInput = document.getElementById('searchInput');
  var emptyState = document.getElementById('emptyState');

  var currentCategory = 'all';
  var currentKeyword = '';

  /* ------------------------------------------
     預約紀錄區段 DOM
     ------------------------------------------ */
  var bookingSection = document.getElementById('bookingRecordSection');

  /* ------------------------------------------
     分類標籤切換
     ------------------------------------------ */
  if (tabsContainer) {
    var allTabs = tabsContainer.querySelectorAll('.life-tab');

    allTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        allTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category');

        // 預約紀錄 tab 特殊處理
        if (currentCategory === 'booking') {
          if (gridContainer) gridContainer.style.display = 'none';
          if (emptyState) emptyState.classList.remove('is-visible');
          if (bookingSection) bookingSection.style.display = '';
          if (searchInput) searchInput.closest('.search-bar').style.display = 'none';
        } else {
          if (gridContainer) gridContainer.style.display = '';
          if (bookingSection) bookingSection.style.display = 'none';
          if (searchInput) searchInput.closest('.search-bar').style.display = '';
          filterCards();
        }
      });
    });
  }

  /* ------------------------------------------
     預約紀錄「查看詳情」按鈕
     ------------------------------------------ */
  var bookingDetailBtns = document.querySelectorAll('.btn-booking-detail');
  bookingDetailBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var bookingId = btn.getAttribute('data-booking-id');
      window.location.href = 'crm-life-service-booking-detail.html?order=' + encodeURIComponent(bookingId);
    });
  });

  /* ------------------------------------------
     搜尋輸入
     ------------------------------------------ */
  if (searchInput) {
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        currentKeyword = searchInput.value.trim().toLowerCase();
        filterCards();
      }, 250);
    });
  }

  /* ------------------------------------------
     篩選卡片顯示
     ------------------------------------------ */
  function filterCards() {
    if (!gridContainer) return;
    var cards = gridContainer.querySelectorAll('.life-service-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var matchCategory = (currentCategory === 'all') || (card.getAttribute('data-category') === currentCategory);
      var matchKeyword = true;

      if (currentKeyword) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var vendor = (card.getAttribute('data-vendor') || '').toLowerCase();
        matchKeyword = name.indexOf(currentKeyword) !== -1 || vendor.indexOf(currentKeyword) !== -1;
      }

      if (matchCategory && matchKeyword) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // 空狀態提示
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('is-visible');
      } else {
        emptyState.classList.remove('is-visible');
      }
    }
  }

  /* ------------------------------------------
     「立即預約」按鈕 — 跳轉至預約頁面
     ------------------------------------------ */
  var bookButtons = document.querySelectorAll('.btn-life-book');
  bookButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.life-service-card');
      var serviceKey = card ? card.getAttribute('data-service') : null;
      if (serviceKey) {
        window.location.href = 'crm-life-service-booking.html?service=' + encodeURIComponent(serviceKey);
      }
    });
  });

  // 初始化：顯示全部卡片
  filterCards();

})();
