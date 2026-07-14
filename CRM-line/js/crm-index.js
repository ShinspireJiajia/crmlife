/* ============================================
   CRM 首頁互動邏輯
   根據 Figma 設計稿 (node-id: 1:2610)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 建案可預約狀態 Mock 資料 ---
  // 模擬建案條件：各服務是否符合可預約狀態
  // 實際串接 API 時，將此物件替換為後端回傳資料
  var reservableStatus = {
    checkup: true,       // 房屋健檢：可預約
    custom: false,       // 客變服務：不可預約
    handover: false,     // 交屋服務：不可預約
    guarantee: true,     // 對保服務：可預約
    inspection: true,    // 驗屋服務：可預約
    facility: true       // 公設預約：可預約
  };

  // 標籤 ID 與狀態鍵值對照
  var tagMap = {
    checkup: 'tagCheckup',
    custom: 'tagCustom',
    handover: 'tagHandover',
    guarantee: 'tagGuarantee',
    inspection: 'tagInspection',
    facility: 'tagFacility'
  };

  // 根據建案條件動態顯示「可預約」標籤
  Object.keys(tagMap).forEach(function (key) {
    var tagEl = document.getElementById(tagMap[key]);
    if (tagEl) {
      if (reservableStatus[key]) {
        tagEl.classList.add('active');
      } else {
        tagEl.classList.remove('active');
      }
    }
  });

  // --- 服務九宮格展開 / 收合邏輯 ---
  var gridInner = document.getElementById('serviceGridInner');
  var btnExpand = document.getElementById('btnExpand');
  var expandText = btnExpand ? btnExpand.querySelector('.expand-text') : null;
  var expandArrow = btnExpand ? btnExpand.querySelector('.expand-arrow') : null;
  var rowExtra = document.getElementById('serviceRowExtra');
  var isExpanded = false;

  // 初始狀態：收合
  if (gridInner) {
    gridInner.classList.add('collapsed');
  }
  if (btnExpand) {
    btnExpand.classList.add('has-gradient');
  }
  if (rowExtra) {
    rowExtra.style.display = 'none';
  }

  if (btnExpand) {
    btnExpand.addEventListener('click', function () {
      isExpanded = !isExpanded;

      if (isExpanded) {
        // 展開
        gridInner.classList.remove('collapsed');
        gridInner.classList.add('expanded');
        btnExpand.classList.remove('has-gradient');
        if (rowExtra) rowExtra.style.display = 'flex';
        if (expandText) expandText.textContent = '收合';
        if (expandArrow) expandArrow.classList.add('rotated');
      } else {
        // 收合
        gridInner.classList.remove('expanded');
        gridInner.classList.add('collapsed');
        btnExpand.classList.add('has-gradient');
        if (rowExtra) rowExtra.style.display = 'none';
        if (expandText) expandText.textContent = '查看更多';
        if (expandArrow) expandArrow.classList.remove('rotated');
      }
    });
  }

  // --- 頁面導航 ---

  // 客變服務
  var btnCustom = document.getElementById('btnCustom');
  if (btnCustom) {
    btnCustom.addEventListener('click', function () {
      window.location.href = 'crm-custom-service.html';
    });
  }

  // 交屋服務
  var btnHandover = document.getElementById('btnHandover');
  if (btnHandover) {
    btnHandover.addEventListener('click', function () {
      window.location.href = 'crm-handover-service.html';
    });
  }

  // 對保服務
  var btnGuarantee = document.getElementById('btnGuarantee');
  if (btnGuarantee) {
    btnGuarantee.addEventListener('click', function () {
      window.location.href = 'crm-guarantee-service.html';
    });
  }

  // 森林聚落
  var btnForest = document.getElementById('btnForest');
  if (btnForest) {
    btnForest.addEventListener('click', function () {
      window.location.href = 'crm-forest-list.html';
    });
  }

  // 生活服務專區
  var btnLifeZone = document.getElementById('btnLifeZone');
  if (btnLifeZone) {
    btnLifeZone.addEventListener('click', function () {
      window.location.href = 'crm-life-service-list.html';
    });
  }

  // --- 其他按鈕（預留 console.log） ---

  // 我要報修
  var btnRepair = document.getElementById('btnRepair');
  if (btnRepair) {
    btnRepair.addEventListener('click', function () {
      window.location.href = 'crm-repair-form.html';
    });
  }

  // 會員中心
  var btnMember = document.getElementById('btnMember');
  if (btnMember) {
    btnMember.addEventListener('click', function () {
      window.location.href = 'crm-member-center.html';
    });
  }

  // 我的包裹（生活版首頁快捷入口）
  var btnPackage = document.getElementById('btnPackage');
  if (btnPackage) {
    btnPackage.addEventListener('click', function () {
      window.location.href = 'crm-package.html';
    });
  }

  // 綠海養護（建案版首頁）／ 訪客登記（生活版首頁 crm-index_life.html 共用同一入口按鈕）
  var btnGreenCare = document.getElementById('btnGreenCare');
  if (btnGreenCare) {
    var isLifeIndex = window.location.pathname.indexOf('crm-index_life') !== -1;
    btnGreenCare.addEventListener('click', function () {
      window.location.href = isLifeIndex ? 'crm-visitor-register.html' : 'crm-green-care.html';
    });
  }

  // 綁定新身分
  var btnBind = document.getElementById('btnBind');
  if (btnBind) {
    btnBind.addEventListener('click', function () {
      window.location.href = 'crm-bind-identity.html';
    });
  }

  // 款項資訊
  var btnPayment = document.getElementById('btnPayment');
  if (btnPayment) {
    btnPayment.addEventListener('click', function () {
      window.location.href = 'crm-payment-info.html';
    });
  }

  // 戶別資訊
  var btnUnit = document.getElementById('btnUnit');
  if (btnUnit) {
    btnUnit.addEventListener('click', function () {
      window.location.href = 'crm-unit-info.html';
    });
  }

  // 款項資訊（社區生活分組）
  var btnPaymentLife = document.getElementById('btnPaymentLife');
  if (btnPaymentLife) {
    btnPaymentLife.addEventListener('click', function () {
      window.location.href = 'crm-payment-info.html';
    });
  }

  // 戶別資訊（社區生活分組）
  var btnUnitLife = document.getElementById('btnUnitLife');
  if (btnUnitLife) {
    btnUnitLife.addEventListener('click', function () {
      window.location.href = 'crm-unit-info.html';
    });
  }

  // 房屋健檢
  var btnCheckup = document.getElementById('btnCheckup');
  if (btnCheckup) {
    btnCheckup.addEventListener('click', function () {
      window.location.href = 'crm-house-checkup.html';
    });
  }

  // 驗屋服務
  var btnInspection = document.getElementById('btnInspection');
  if (btnInspection) {
    btnInspection.addEventListener('click', function () {
      window.location.href = 'crm-inspection-service.html';
    });
  }

  // 超瓦斯表
  var btnGas = document.getElementById('btnGas');
  if (btnGas) {
    btnGas.addEventListener('click', function () {
      window.location.href = 'crm-gas-meter.html';
    });
  }

  // 公設預約
  var btnFacility = document.getElementById('btnFacility');
  if (btnFacility) {
    btnFacility.addEventListener('click', function () {
      window.location.href = 'crm-facility-reserve.html';
    });
  }

  // 通知
  var btnNotify = document.getElementById('btnNotify');
  if (btnNotify) {
    btnNotify.addEventListener('click', function () {
      window.location.href = 'crm-notification.html';
    });
  }

  // --- 報修卡片「內容查看」按鈕 ---
  var viewButtons = document.querySelectorAll('.btn-view-order');
  viewButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.repair-order-card');
      // 若卡片有自訂連結（含報價/付款參數），優先使用
      var customHref = card ? card.getAttribute('data-href') : null;
      if (customHref) {
        window.location.href = customHref;
        return;
      }
      var orderNum = card ? card.querySelector('.order-number') : null;
      var statusEl = card ? card.querySelector('.order-status span') : null;
      var status = statusEl ? statusEl.textContent.trim() : '';
      var num = orderNum ? orderNum.textContent.trim() : '';
      // 根據狀態導向報修內容查看頁
      window.location.href = 'crm-repair-detail.html?order=' + encodeURIComponent(num) + '&status=' + encodeURIComponent(status);
    });
  });

  // --- 鄰里生活服務專區：共用狀態 ---
  var lifeServiceTabs = document.getElementById('lifeServiceTabs');
  var lifeServiceGrid = document.getElementById('lifeServiceGrid');
  var lifeServiceToggle = document.getElementById('lifeServiceToggle');
  var lifeServiceSection = document.querySelector('.life-service-section');
  var lifeExpanded = false;    // 預設收合
  var VISIBLE_COUNT = 2;       // 收合時顯示的卡片數量
  var currentCategory = 'all'; // 預設分類

  /**
   * 根據目前分類與展開狀態，重新計算每張卡片的顯示/隱藏
   */
  function refreshLifeCards() {
    if (!lifeServiceGrid) return;
    var cards = lifeServiceGrid.querySelectorAll('.life-service-card');
    var visibleIndex = 0;

    cards.forEach(function (card) {
      var matchCategory = (currentCategory === 'all') || (card.getAttribute('data-category') === currentCategory);

      if (!matchCategory) {
        // 不符合分類 → 隱藏
        card.style.display = 'none';
      } else if (lifeExpanded) {
        // 展開模式 → 符合分類的全部顯示
        card.style.display = '';
      } else {
        // 收合模式 → 只顯示前 N 張符合分類的卡片
        card.style.display = visibleIndex < VISIBLE_COUNT ? '' : 'none';
        visibleIndex++;
      }
    });
  }

  // --- 鄰里生活服務專區：標籤切換邏輯 ---
  if (lifeServiceTabs && lifeServiceGrid) {
    var allTabs = lifeServiceTabs.querySelectorAll('.life-tab');

    allTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // 切換 active 狀態
        allTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        // 更新分類並重繪卡片
        currentCategory = tab.getAttribute('data-category');
        refreshLifeCards();
      });
    });
  }

  // --- 鄰里生活服務專區：收合 / 展開邏輯 ---
  if (lifeServiceToggle && lifeServiceSection) {
    var toggleText = lifeServiceToggle.querySelector('.toggle-text');
    var toggleArrow = lifeServiceToggle.querySelector('.toggle-arrow');

    // 初始化：收合模式只顯示前 N 張卡片（標籤列保持顯示）
    refreshLifeCards();

    lifeServiceToggle.addEventListener('click', function () {
      lifeExpanded = !lifeExpanded;

      if (lifeExpanded) {
        if (toggleText) toggleText.textContent = '收合';
        if (toggleArrow) toggleArrow.classList.add('rotated');
      } else {
        if (toggleText) toggleText.textContent = '展開更多';
        if (toggleArrow) toggleArrow.classList.remove('rotated');
      }

      refreshLifeCards();
    });
  }

  // --- 鄰里生活服務：預約申請 Modal 邏輯 ---

  // 各商家服務資料
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
    }
  };

  var bookOverlay = document.getElementById('bookModalOverlay');
  var bookCloseBtn = document.getElementById('bookModalClose');
  var bookForm = document.getElementById('bookForm');
  var bookMerchantImg = document.getElementById('bookMerchantImg');
  var bookMerchantName = document.getElementById('bookMerchantName');
  var bookMerchantTagline = document.getElementById('bookMerchantTagline');
  var bookPromoDesc = document.getElementById('bookPromoDesc');
  var bookServiceSelection = document.getElementById('bookServiceSelection');

  /**
   * 開啟預約 Modal 並填入對應商家資料
   * @param {string} serviceKey - 商家資料鍵值
   */
  function openBookModal(serviceKey) {
    var data = serviceData[serviceKey];
    if (!data || !bookOverlay) return;

    // 填入商家資訊
    if (bookMerchantImg) {
      bookMerchantImg.src = data.img;
      bookMerchantImg.alt = data.name;
    }
    if (bookMerchantName) bookMerchantName.textContent = data.name;
    if (bookMerchantTagline) bookMerchantTagline.textContent = data.tagline;
    if (bookPromoDesc) bookPromoDesc.textContent = data.promo;

    // 動態產生服務項目 radio
    if (bookServiceSelection) {
      bookServiceSelection.innerHTML = '';
      data.services.forEach(function (svc, idx) {
        var label = document.createElement('label');
        label.className = 'book-service-option';

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'bookService';
        radio.value = svc.value;
        if (idx === 0) radio.required = true;

        var labelDiv = document.createElement('div');
        labelDiv.className = 'book-service-label';

        var nameSpan = document.createElement('span');
        nameSpan.textContent = svc.name;

        var priceSpan = document.createElement('span');
        priceSpan.className = svc.isEstimate ? '' : 'book-service-price';
        if (svc.isEstimate) priceSpan.style.color = '#999';
        priceSpan.textContent = svc.price;

        labelDiv.appendChild(nameSpan);
        labelDiv.appendChild(priceSpan);
        label.appendChild(radio);
        label.appendChild(labelDiv);
        bookServiceSelection.appendChild(label);
      });
    }

    // 更新備註 placeholder
    var textarea = bookOverlay.querySelector('textarea.book-input');
    if (textarea) textarea.placeholder = data.placeholder || '請輸入備註事項...';

    // 重置表單（保留戶別）
    if (bookForm) bookForm.reset();

    // 顯示 Modal
    bookOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 關閉預約 Modal
   */
  function closeBookModal() {
    if (!bookOverlay) return;
    bookOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // 關閉按鈕
  if (bookCloseBtn) {
    bookCloseBtn.addEventListener('click', closeBookModal);
  }

  // 點擊遮罩背景關閉
  if (bookOverlay) {
    bookOverlay.addEventListener('click', function (e) {
      if (e.target === bookOverlay) closeBookModal();
    });
  }

  // 表單送出
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('預約已送出！我們將盡快與您聯繫確認。');
      closeBookModal();
    });
  }

  // 為每個「立即預約」按鈕綁定事件
  var bookButtons = document.querySelectorAll('.btn-life-book');
  bookButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = btn.closest('.life-service-card');
      var serviceKey = card ? card.getAttribute('data-service') : null;
      if (serviceKey) openBookModal(serviceKey);
    });
  });

});
