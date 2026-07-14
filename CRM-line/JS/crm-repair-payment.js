/* ============================================
   報修付款頁面互動邏輯
   參考 crm-forest-payment.js 規則
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- DOM 元素取得 --- */
  var btnConfirm = document.getElementById('btnConfirm');
  var btnCancel = document.getElementById('btnCancel');
  var radioButtons = document.querySelectorAll('input[name="paymentMethod"]');

  /* --- 從 URL 取得付款資料參數 --- */
  var urlParams = new URLSearchParams(window.location.search);
  var caseNo = urlParams.get('caseNo') || '';
  var quotationNo = urlParams.get('quotationNo') || '';
  var amount = urlParams.get('amount') || '0';

  /* --- 填入頁面顯示資訊 --- */
  var displayAmount = document.getElementById('displayAmount');
  var displayQuotationNo = document.getElementById('displayQuotationNo');
  var displayCaseNo = document.getElementById('displayCaseNo');

  if (displayAmount) displayAmount.textContent = 'NT$ ' + amount;
  if (displayQuotationNo) displayQuotationNo.textContent = quotationNo;
  if (displayCaseNo) displayCaseNo.textContent = caseNo;

  /**
   * 取得目前選擇的付款方式
   * @returns {string} 付款方式值
   */
  function getSelectedPayment() {
    var selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected ? selected.value : '';
  }

  /* --- Radio 選項點擊回饋 --- */
  radioButtons.forEach(function (radio) {
    radio.addEventListener('change', function () {
      // 移除所有選項的選中視覺效果
      document.querySelectorAll('.payment-option').forEach(function (opt) {
        opt.classList.remove('selected');
      });
      // 為目前選中的選項加上效果
      var parentOption = radio.closest('.payment-option');
      if (parentOption) {
        parentOption.classList.add('selected');
      }
    });

    // 初始化：替預設選中的項目加上效果
    if (radio.checked) {
      var parentOption = radio.closest('.payment-option');
      if (parentOption) {
        parentOption.classList.add('selected');
      }
    }
  });

  /* --- 確認付款按鈕 --- */
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      var method = getSelectedPayment();
      if (!method) {
        alert('請選擇支付方式');
        return;
      }

      // --- 發票資料驗證 ---
      var invoiceType = getSelectedInvoice();
      var invoiceData = {};

      if (invoiceType === 'mobile-barcode') {
        var barcode = document.getElementById('mobileBarcode');
        var barcodeVal = barcode ? barcode.value.trim() : '';
        if (!barcodeVal || !/^\/[A-Z0-9+\-.]{7}$/.test(barcodeVal)) {
          alert('請輸入正確的手機條碼載具編號\n（斜線開頭 + 7 碼大寫英數字）');
          if (barcode) barcode.focus();
          return;
        }
        invoiceData = { type: '手機條碼載具', barcode: barcodeVal };
      } else if (invoiceType === 'donate') {
        invoiceData = { type: '捐贈發票', donateCode: '919' };
      } else if (invoiceType === 'triple') {
        var taxId = document.getElementById('companyTaxId');
        var companyName = document.getElementById('companyName');
        var taxIdVal = taxId ? taxId.value.trim() : '';
        var companyNameVal = companyName ? companyName.value.trim() : '';
        if (!taxIdVal || !/^\d{8}$/.test(taxIdVal)) {
          alert('請輸入正確的 8 碼統一編號');
          if (taxId) taxId.focus();
          return;
        }
        if (!companyNameVal) {
          alert('請輸入公司抬頭');
          if (companyName) companyName.focus();
          return;
        }
        invoiceData = { type: '三聯式發票', taxId: taxIdVal, companyName: companyNameVal };
      }

      // 付款方式名稱對照
      var methodLabels = {
        'credit-card': '信用卡',
        'line-pay': 'LINE PAY',
        'atm': 'ATM 虛擬帳號轉帳'
      };

      console.log('報修付款資訊：', {
        caseNo: caseNo,
        quotationNo: quotationNo,
        amount: amount,
        paymentMethod: method,
        paymentLabel: methodLabels[method] || method,
        invoice: invoiceData
      });

      // 模擬導向金流頁面，交易完成後跳轉結果頁
      // 實際對接時由金流 API 回傳結果決定 status=success 或 status=fail
      var resultUrl = 'crm-repair-payment-result.html?status=success' +
        '&caseNo=' + encodeURIComponent(caseNo) +
        '&quotationNo=' + encodeURIComponent(quotationNo) +
        '&amount=' + encodeURIComponent(amount) +
        '&method=' + encodeURIComponent(methodLabels[method]);
      window.location.href = resultUrl;
    });
  }

  /* --- 取消按鈕：返回上一頁 --- */
  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      window.history.back();
    });
  }

  /* --- 發票類型選擇邏輯 --- */
  var invoiceRadios = document.querySelectorAll('input[name="invoiceType"]');
  var mobileArea = document.getElementById('mobileArea');
  var tripleArea = document.getElementById('tripleArea');

  /**
   * 取得目前選擇的發票類型
   * @returns {string} 發票類型值
   */
  function getSelectedInvoice() {
    var selected = document.querySelector('input[name="invoiceType"]:checked');
    return selected ? selected.value : '';
  }

  /**
   * 根據選取的發票類型切換顯示對應輸入區
   */
  function toggleInvoiceAreas() {
    var selected = getSelectedInvoice();
    if (mobileArea) mobileArea.style.display = (selected === 'mobile-barcode') ? 'block' : 'none';
    if (tripleArea) tripleArea.style.display = (selected === 'triple') ? 'block' : 'none';
  }

  invoiceRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      // 切換選中視覺效果
      document.querySelectorAll('.invoice-option').forEach(function (opt) {
        opt.classList.remove('selected');
      });
      var parentOption = radio.closest('.invoice-option');
      if (parentOption) parentOption.classList.add('selected');

      // 切換對應輸入區
      toggleInvoiceAreas();
    });
  });

  // --- 從會員中心讀取已儲存的發票設定，預帶入表單 ---
  function loadMemberInvoiceSetting() {
    try {
      var stored = localStorage.getItem('memberInvoiceSetting');
      if (!stored) return;
      var setting = JSON.parse(stored);

      // 將會員中心的 type 對應到付款頁 radio 值
      var typeMap = { 'barcode': 'mobile-barcode', 'email': 'mobile-barcode', 'triple': 'triple' };
      var targetValue = typeMap[setting.type] || 'mobile-barcode';

      // 選取對應的 radio
      invoiceRadios.forEach(function (radio) {
        if (radio.value === targetValue) {
          radio.checked = true;
          // 更新選中視覺效果
          document.querySelectorAll('.invoice-option').forEach(function (opt) {
            opt.classList.remove('selected');
          });
          var parentOption = radio.closest('.invoice-option');
          if (parentOption) parentOption.classList.add('selected');
        }
      });

      // 填入對應欄位值
      if (setting.type === 'barcode' || setting.type === 'email') {
        var barcodeInput = document.getElementById('mobileBarcode');
        if (barcodeInput && setting.barcode) {
          barcodeInput.value = setting.barcode;
        }
      } else if (setting.type === 'triple') {
        var taxIdInput = document.getElementById('companyTaxId');
        var companyInput = document.getElementById('companyName');
        if (taxIdInput && setting.taxId) taxIdInput.value = setting.taxId;
        if (companyInput && setting.companyName) companyInput.value = setting.companyName;
      }

      // 更新輸入區域顯示
      toggleInvoiceAreas();
    } catch (e) { /* ignore */ }
  }

  // 初始化發票區域顯示並預帶會員設定
  loadMemberInvoiceSetting();

});
