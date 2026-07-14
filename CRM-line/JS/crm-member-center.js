/* ============================================
   會員中心互動邏輯
   根據 Figma 設計稿 (node-id: 326:1721)
   功能：選單導航、發票類型選擇、發票設定彈窗
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Mock 資料 — 模擬使用者最後儲存的發票設定
  // 實際串接 API 時，替換為後端回傳資料
  // 優先從 localStorage 讀取，若無則使用 Mock 預設值
  // ============================================
  var defaultInvoice = {
    type: 'barcode',       // 'email' | 'barcode' | 'triple'
    email: '',
    barcode: '/1234ABC',
    companyName: '',
    taxId: ''
  };
  var savedInvoice = (function () {
    try {
      var stored = localStorage.getItem('memberInvoiceSetting');
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return defaultInvoice;
  })();

  // ============================================
  // DOM 元素取得
  // ============================================
  var btnMemberInfo = document.getElementById('btnMemberInfo');
  var btnChangeSetting = document.getElementById('btnChangeSetting');
  var invoiceDisplay = document.getElementById('invoiceDisplay');

  // Action Sheet 元素
  var invoiceTypeOverlay = document.getElementById('invoiceTypeOverlay');
  var invoiceTypeSheet = document.getElementById('invoiceTypeSheet');

  // 彈窗元素
  var invoiceModalOverlay = document.getElementById('invoiceModalOverlay');
  var invoiceTypeSelect = document.getElementById('invoiceTypeSelect');
  var btnModalCancel = document.getElementById('btnModalCancel');
  var btnModalConfirm = document.getElementById('btnModalConfirm');

  // 欄位群組
  var fieldEmail = document.getElementById('fieldEmail');
  var fieldBarcode = document.getElementById('fieldBarcode');
  var fieldTriple = document.getElementById('fieldTriple');

  // 輸入欄位
  var inputEmail = document.getElementById('inputEmail');
  var inputBarcode = document.getElementById('inputBarcode');
  var inputCompany = document.getElementById('inputCompany');
  var inputTaxId = document.getElementById('inputTaxId');

  // ============================================
  // 頁面初始化 — 顯示上次儲存的發票資訊
  // ============================================
  updateInvoiceDisplay();

  // ============================================
  // 選單導航事件
  // ============================================

  // 會員資訊 → 前往會員資料頁
  if (btnMemberInfo) {
    btnMemberInfo.addEventListener('click', function () {
      window.location.href = 'crm-member-profile.html';
    });
  }

  // 變更屋主密碼
  var btnChangeOwnerPwd = document.getElementById('btnChangeOwnerPwd');
  if (btnChangeOwnerPwd) {
    btnChangeOwnerPwd.addEventListener('click', function () {
      console.log('前往變更屋主密碼');
    });
  }

  // 變更戶別密碼
  var btnChangeUnitPwd = document.getElementById('btnChangeUnitPwd');
  if (btnChangeUnitPwd) {
    btnChangeUnitPwd.addEventListener('click', function () {
      console.log('前往變更戶別密碼');
    });
  }

  // 查詢密碼
  var btnQueryPwd = document.getElementById('btnQueryPwd');
  if (btnQueryPwd) {
    btnQueryPwd.addEventListener('click', function () {
      console.log('前往查詢密碼');
    });
  }

  // ============================================
  // 發票設定流程
  // ============================================

  // 步驟 1：點擊「更改設定」→ 顯示 Action Sheet
  if (btnChangeSetting) {
    btnChangeSetting.addEventListener('click', function () {
      showActionSheet();
    });
  }

  // 點擊 Action Sheet 外部區域關閉
  if (invoiceTypeOverlay) {
    invoiceTypeOverlay.addEventListener('click', function (e) {
      if (e.target === invoiceTypeOverlay) {
        hideActionSheet();
      }
    });
  }

  // 步驟 2：選擇發票類型 → 關閉 Action Sheet、開啟設定彈窗
  if (invoiceTypeSheet) {
    var options = invoiceTypeSheet.querySelectorAll('.action-sheet-option');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        var selectedType = option.getAttribute('data-type');
        hideActionSheet();
        openInvoiceModal(selectedType);
      });
    });
  }

  // 發票類型下拉選單切換欄位
  if (invoiceTypeSelect) {
    invoiceTypeSelect.addEventListener('change', function () {
      toggleInvoiceFields(invoiceTypeSelect.value);
    });
  }

  // 彈窗「取消」按鈕
  if (btnModalCancel) {
    btnModalCancel.addEventListener('click', function () {
      hideInvoiceModal();
    });
  }

  // 彈窗外部點擊關閉
  if (invoiceModalOverlay) {
    invoiceModalOverlay.addEventListener('click', function (e) {
      if (e.target === invoiceModalOverlay) {
        hideInvoiceModal();
      }
    });
  }

  // 步驟 3：點擊「更改設定」→ 儲存並更新顯示
  if (btnModalConfirm) {
    btnModalConfirm.addEventListener('click', function () {
      saveInvoiceSetting();
    });
  }

  // ============================================
  // 工具函式
  // ============================================

  /**
   * 更新發票資訊顯示區
   * 根據 savedInvoice 資料顯示對應的發票類型與數值
   */
  function updateInvoiceDisplay() {
    if (!invoiceDisplay) return;

    var typeLabel = '';
    var valueText = '';

    switch (savedInvoice.type) {
      case 'email':
        typeLabel = '電子信箱';
        valueText = savedInvoice.email || '';
        break;
      case 'barcode':
        typeLabel = '手機條碼';
        valueText = savedInvoice.barcode || '';
        break;
      case 'triple':
        typeLabel = '三聯式發票';
        valueText = (savedInvoice.companyName || '') + '\n' + (savedInvoice.taxId || '');
        break;
    }

    invoiceDisplay.innerHTML =
      '<span class="invoice-type-label">' + escapeHtml(typeLabel) + '</span>' +
      '<span class="invoice-value">' + escapeHtml(valueText) + '</span>';
  }

  /**
   * 顯示 Action Sheet（發票類型選擇）
   */
  function showActionSheet() {
    if (invoiceTypeOverlay) {
      invoiceTypeOverlay.classList.add('active');
    }
  }

  /**
   * 隱藏 Action Sheet
   */
  function hideActionSheet() {
    if (invoiceTypeOverlay) {
      invoiceTypeOverlay.classList.remove('active');
    }
  }

  /**
   * 開啟發票設定彈窗
   * @param {string} type - 發票類型 ('email' | 'barcode' | 'triple')
   */
  function openInvoiceModal(type) {
    // 設定下拉選單值
    if (invoiceTypeSelect) {
      invoiceTypeSelect.value = type;
    }

    // 切換欄位顯示
    toggleInvoiceFields(type);

    // 填入已儲存的值
    populateFields();

    // 顯示彈窗
    if (invoiceModalOverlay) {
      invoiceModalOverlay.classList.add('active');
    }
  }

  /**
   * 隱藏發票設定彈窗
   */
  function hideInvoiceModal() {
    if (invoiceModalOverlay) {
      invoiceModalOverlay.classList.remove('active');
    }
    // 清空輸入欄位
    clearFields();
  }

  /**
   * 切換發票類型對應的輸入欄位
   * @param {string} type - 發票類型
   */
  function toggleInvoiceFields(type) {
    // 先全部隱藏
    if (fieldEmail) fieldEmail.classList.add('hidden');
    if (fieldBarcode) fieldBarcode.classList.add('hidden');
    if (fieldTriple) fieldTriple.classList.add('hidden');

    // 顯示對應欄位
    switch (type) {
      case 'email':
        if (fieldEmail) fieldEmail.classList.remove('hidden');
        break;
      case 'barcode':
        if (fieldBarcode) fieldBarcode.classList.remove('hidden');
        break;
      case 'triple':
        if (fieldTriple) fieldTriple.classList.remove('hidden');
        break;
    }
  }

  /**
   * 填充已儲存的欄位值
   */
  function populateFields() {
    if (inputEmail) inputEmail.value = savedInvoice.email || '';
    if (inputBarcode) inputBarcode.value = savedInvoice.barcode || '';
    if (inputCompany) inputCompany.value = savedInvoice.companyName || '';
    if (inputTaxId) inputTaxId.value = savedInvoice.taxId || '';
  }

  /**
   * 清空所有輸入欄位
   */
  function clearFields() {
    if (inputEmail) inputEmail.value = '';
    if (inputBarcode) inputBarcode.value = '';
    if (inputCompany) inputCompany.value = '';
    if (inputTaxId) inputTaxId.value = '';
  }

  /**
   * 儲存發票設定
   * 讀取當前選擇的發票類型與對應輸入值，更新 savedInvoice 並刷新顯示
   */
  function saveInvoiceSetting() {
    var currentType = invoiceTypeSelect ? invoiceTypeSelect.value : 'barcode';

    // 更新儲存資料
    savedInvoice.type = currentType;

    switch (currentType) {
      case 'email':
        savedInvoice.email = inputEmail ? inputEmail.value.trim() : '';
        break;
      case 'barcode':
        savedInvoice.barcode = inputBarcode ? inputBarcode.value.trim() : '';
        break;
      case 'triple':
        savedInvoice.companyName = inputCompany ? inputCompany.value.trim() : '';
        savedInvoice.taxId = inputTaxId ? inputTaxId.value.trim() : '';
        break;
    }

    // 更新頁面顯示
    updateInvoiceDisplay();

    // 關閉彈窗
    hideInvoiceModal();

    // 將發票設定存入 localStorage，供付款頁面預帶
    try {
      localStorage.setItem('memberInvoiceSetting', JSON.stringify(savedInvoice));
    } catch (e) { /* ignore */ }

    // 實際專案中，這裡應呼叫 API 將設定儲存至後端
    console.log('發票設定已儲存：', savedInvoice);
  }

  /**
   * HTML 跳脫函式，防止 XSS
   * @param {string} text - 原始字串
   * @returns {string} 跳脫後的安全字串
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

});
