/* ============================================
   戶別詳情頁面互動邏輯
   房屋保固、建案工程進度、合約紀錄、履約款項
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 頁面標題對照 ---
  var tabTitles = {
    warranty: '房屋保固',
    progress: '建案工程進度',
    contract: '合約紀錄',
    payment: '履約款項'
  };

  // --- Mock 資料 ---

  // 房屋保固資料
  var warrantyData = {
    buildingProject: '綠海建案',
    unitNumber: 'A3-3',
    items: [
      { label: '防水工程保固到期日', value: '2028/05/31' },
      { label: '地壁磚/木地板保固到期日', value: '2028/05/31' },
      { label: '機電設備保固到期日', value: '2028/05/31' },
      { label: '結水設備保固到期日', value: '2028/05/31' },
      { label: '排水設備保固到期日', value: '2028/05/31' },
      { label: '門窗設備保固到期日', value: '2028/05/31' },
      { label: '電器設備保固到期日', value: '2028/05/31' },
      { label: '公共設備保固到期日', value: '2028/05/31' },
      { label: '廚櫃設備保固到期日', value: '2028/05/31' },
      { label: '建築工程保固到期日', value: '2028/05/31' },
      { label: '衛浴設備保固到期日', value: '2028/05/31' },
      { label: '固定建材保固到期日', value: '2028/05/31' },
      { label: '其他設備保固到期日', value: '2028/05/31' },
      { label: '結構設備保固到期日', value: '2028/05/31' }
    ]
  };

  // 建案工程進度資料
  var progressData = [
    { id: 'p001', name: '6FL板金查驗' },
    { id: 'p002', name: '機車區牆磚施作' },
    { id: 'p003', name: '戶內木門門框施作' }
  ];

  // 合約紀錄資料
  var contractData = [
    { name: '房屋買賣契約', file: 'house-sale-contract.pdf' },
    { name: '房屋標準圖面', file: 'house-standard-plan.pdf' },
    { name: '房屋客變圖面', file: 'house-custom-plan.pdf' }
  ];

  // 履約款項資料
  var paymentInfo = {
    currentProgress: '十六樓頂版完成',
    bankAccount: '7109-4521-3258'
  };
  var paymentData = [
    { id: 'pay001', code: '001', name: '訂金', amount: 2980000, payDate: '2025/01/06', status: 'paid' },
    { id: 'pay002', code: '002', name: '簽約金', amount: 5970000, payDate: '2025/01/06', status: 'paid' },
    { id: 'pay003', code: '003', name: '開工款', amount: 2980000, payDate: '', status: 'unpaid' },
    { id: 'pay004', code: '004', name: '交屋尾款', amount: 11000000, payDate: '', status: 'unpaid' }
  ];

  // --- 取得 URL 參數 ---
  var urlParams = new URLSearchParams(window.location.search);
  var initialTab = urlParams.get('tab') || 'warranty';

  // --- DOM 元素 ---
  var pageTitle = document.getElementById('pageTitle');
  var tabNav = document.getElementById('tabNav');
  var tabBtns = tabNav.querySelectorAll('.tab-btn');
  var panels = {
    warranty: document.getElementById('panelWarranty'),
    progress: document.getElementById('panelProgress'),
    contract: document.getElementById('panelContract'),
    payment: document.getElementById('panelPayment')
  };

  // --- 渲染無資料狀態 ---
  function renderEmptyState() {
    return '' +
      '<div class="empty-state">' +
        '<div class="empty-icon">' +
          '<img src="assets/empty-record-icon.svg" alt="">' +
        '</div>' +
        '<p class="empty-text">無相關紀錄</p>' +
      '</div>';
  }

  // --- 渲染房屋保固面板 ---
  function renderWarrantyPanel() {
    if (!warrantyData || !warrantyData.items || warrantyData.items.length === 0) {
      panels.warranty.innerHTML = renderEmptyState();
      return;
    }

    var html = '<div class="warranty-form">';

    // 建案
    html += '<div class="warranty-field">' +
      '<p class="field-label">建案</p>' +
      '<div class="field-value">' + warrantyData.buildingProject + '</div>' +
    '</div>';

    // 戶別
    html += '<div class="warranty-field">' +
      '<p class="field-label">戶別</p>' +
      '<div class="field-value">' + warrantyData.unitNumber + '</div>' +
    '</div>';

    // 保固項目
    for (var i = 0; i < warrantyData.items.length; i++) {
      var item = warrantyData.items[i];
      html += '<div class="warranty-field">' +
        '<p class="field-label">' + item.label + '</p>' +
        '<div class="field-value">' + item.value + '</div>' +
      '</div>';
    }

    html += '</div>';
    panels.warranty.innerHTML = html;
  }

  // --- 渲染建案工程進度面板 ---
  function renderProgressPanel() {
    if (!progressData || progressData.length === 0) {
      panels.progress.innerHTML = renderEmptyState();
      return;
    }

    var html = '<div class="progress-list">';
    for (var i = 0; i < progressData.length; i++) {
      var item = progressData[i];
      html += '<div class="progress-card" data-id="' + item.id + '">' +
        '<p class="progress-name">' + item.name + '</p>' +
        '<img class="chevron-icon" src="assets/chevron-right-gold.svg" alt="">' +
      '</div>';
    }
    html += '</div>';
    panels.progress.innerHTML = html;
  }

  // --- 渲染合約紀錄面板 ---
  function renderContractPanel() {
    if (!contractData || contractData.length === 0) {
      panels.contract.innerHTML = renderEmptyState();
      return;
    }

    var html = '<div class="contract-list">';
    for (var i = 0; i < contractData.length; i++) {
      var item = contractData[i];
      html += '<div class="contract-item">' +
        '<p class="contract-name">' + item.name + '</p>' +
        '<button class="btn-download" data-file="' + item.file + '" aria-label="下載 ' + item.name + '">' +
          '<img src="assets/download-btn.svg" alt="下載">' +
        '</button>' +
      '</div>';
    }
    html += '</div>';
    panels.contract.innerHTML = html;
  }

  // --- 格式化金額 ---
  function formatAmount(num) {
    return '＄' + num.toLocaleString('en-US');
  }

  // --- 渲染履約款項面板 ---
  function renderPaymentPanel() {
    if (!paymentData || paymentData.length === 0) {
      panels.payment.innerHTML = renderEmptyState();
      return;
    }

    var html = '<div class="payment-section">';

    // 目前工程進度
    html += '<div class="payment-info-card">' +
      '<div class="info-row">' +
        '<div class="info-label-group">' +
          '<svg class="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">' +
            '<rect x="0" y="3" width="20" height="17" rx="2" stroke="#3a4246" stroke-width="2" fill="none"/>' +
            '<line x1="0" y1="7" x2="20" y2="7" stroke="#3a4246" stroke-width="2"/>' +
            '<line x1="5" y1="0" x2="5" y2="4" stroke="#3a4246" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="15" y1="0" x2="15" y2="4" stroke="#3a4246" stroke-width="2" stroke-linecap="round"/>' +
            '<text x="7" y="15" font-size="6" font-weight="bold" fill="#b8a676">1</text>' +
          '</svg>' +
          '<span class="info-label">目前工程進度</span>' +
        '</div>' +
        '<span class="info-value">' + paymentInfo.currentProgress + '</span>' +
      '</div>' +
    '</div>';

    // 帳號
    html += '<div class="payment-info-card">' +
      '<div class="info-row">' +
        '<div class="info-label-group">' +
          '<svg class="info-icon" width="20" height="14" viewBox="0 0 20 14" fill="none">' +
            '<rect x="0" y="0" width="20" height="14" rx="2" stroke="#3a4246" stroke-width="2" fill="none"/>' +
            '<line x1="0" y1="5" x2="20" y2="5" stroke="#3a4246" stroke-width="3"/>' +
            '<text x="2" y="12" font-size="6" font-weight="bold" fill="#b8a676">BANK</text>' +
          '</svg>' +
          '<span class="info-label">帳號</span>' +
        '</div>' +
        '<span class="info-value">' + paymentInfo.bankAccount + '</span>' +
      '</div>' +
    '</div>';

    // 履約款項標題
    html += '<div class="payment-section-title">' +
      '<svg class="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
        '<rect x="3" y="2" width="18" height="20" rx="2" stroke="#3a4246" stroke-width="1.5" fill="none"/>' +
        '<line x1="7" y1="7" x2="17" y2="7" stroke="#3a4246" stroke-width="1.5"/>' +
        '<line x1="7" y1="11" x2="17" y2="11" stroke="#3a4246" stroke-width="1.5"/>' +
        '<line x1="7" y1="15" x2="13" y2="15" stroke="#3a4246" stroke-width="1.5"/>' +
      '</svg>' +
      '<span>履約款項</span>' +
    '</div>';

    // 款項卡片列表
    for (var i = 0; i < paymentData.length; i++) {
      var item = paymentData[i];
      var statusClass = item.status === 'paid' ? 'status-paid' : 'status-unpaid';
      var statusText = item.status === 'paid' ? '已付款' : '未繳款';
      var dateText = item.payDate || '---';

      html += '<div class="payment-card" data-id="' + item.id + '">' +
        '<div class="payment-card-header">' +
          '<p class="payment-card-title">' + item.code + ' / ' + item.name + '</p>' +
          '<img class="chevron-icon" src="assets/chevron-right-gold.svg" alt="">' +
        '</div>' +
        '<div class="payment-card-body">' +
          '<div class="payment-amount-row">' +
            '<span class="amount-label">應繳金額</span>' +
            '<span class="amount-value">' + formatAmount(item.amount) + '</span>' +
          '</div>' +
          '<div class="payment-date-row">' +
            '<span class="date-text">繳款日期 ' + dateText + '</span>' +
            '<span class="payment-status ' + statusClass + '">' + statusText + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    html += '</div>';
    panels.payment.innerHTML = html;
  }

  // --- 初始渲染所有面板 ---
  renderWarrantyPanel();
  renderProgressPanel();
  renderContractPanel();
  renderPaymentPanel();

  // --- 分頁切換邏輯 ---
  function switchTab(tabKey) {
    // 更新標籤狀態
    for (var i = 0; i < tabBtns.length; i++) {
      var btn = tabBtns[i];
      if (btn.getAttribute('data-tab') === tabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }

    // 更新面板顯示
    var keys = Object.keys(panels);
    for (var j = 0; j < keys.length; j++) {
      if (keys[j] === tabKey) {
        panels[keys[j]].classList.add('active');
      } else {
        panels[keys[j]].classList.remove('active');
      }
    }

    // 更新頁面標題
    if (pageTitle && tabTitles[tabKey]) {
      pageTitle.textContent = tabTitles[tabKey];
    }

    // 將選中標籤滑入可視區域
    var activeBtn = tabNav.querySelector('.tab-btn[data-tab="' + tabKey + '"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // 設定初始分頁
  switchTab(initialTab);

  // 分頁點擊事件
  tabNav.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    var tabKey = btn.getAttribute('data-tab');
    if (tabKey) {
      switchTab(tabKey);
    }
  });

  // --- 建案工程進度卡片點擊 ---
  panels.progress.addEventListener('click', function (e) {
    var card = e.target.closest('.progress-card');
    if (card) {
      var progressId = card.getAttribute('data-id');
      window.location.href = 'crm-progress-detail.html?id=' + encodeURIComponent(progressId);
    }
  });

  // --- 合約紀錄下載按鈕 ---
  panels.contract.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-download');
    if (btn) {
      var fileName = btn.getAttribute('data-file');
      console.log('下載合約：' + fileName);
    }
  });

  // --- 履約款項卡片點擊（跳轉至款項明細） ---
  panels.payment.addEventListener('click', function (e) {
    var card = e.target.closest('.payment-card');
    if (card) {
      var paymentId = card.getAttribute('data-id');
      window.location.href = 'crm-payment-detail.html?id=' + paymentId;
    }
  });

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-unit-info.html';
      }
    });
  }

});
