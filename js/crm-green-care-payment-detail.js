/* ============================================
   綠海養護 - 款項明細頁面互動邏輯
   未繳款 (node-id: 1:3651)
   已繳款 (node-id: 1:4057)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnTransferDone = document.getElementById('btnTransferDone');
  var btnCancel = document.getElementById('btnCancel');

  // 狀態元素
  var bankAccountCard = document.getElementById('bankAccountCard');
  var statusUnpaid = document.getElementById('statusUnpaid');
  var statusPaid = document.getElementById('statusPaid');
  var statusChecking = document.getElementById('statusChecking');
  var invoiceDetail = document.getElementById('invoiceDetail');
  var invoiceSection = document.getElementById('invoiceSection');
  var paymentFooter = document.getElementById('paymentFooter');

  // 轉帳帳戶相關元素
  var transferAccountSection = document.getElementById('transferAccountSection');
  var transferRemarkSection = document.getElementById('transferRemarkSection');

  // --- 從 URL 參數取得付款狀態 ---
  var urlParams = new URLSearchParams(window.location.search);
  var paymentStatus = urlParams.get('status') || 'unpaid';

  // --- 根據狀態切換顯示 ---
  function renderByStatus(status) {
    if (status === 'paid') {
      // 已繳款模式：顯示銀行帳號、發票明細；隱藏轉帳資訊與發票選擇
      bankAccountCard.classList.remove('hidden');
      statusUnpaid.classList.add('hidden');
      statusPaid.classList.remove('hidden');
      if (statusChecking) statusChecking.classList.add('hidden');
      invoiceDetail.classList.remove('hidden');
      if (transferAccountSection) transferAccountSection.classList.add('hidden');
      if (transferRemarkSection) transferRemarkSection.classList.add('hidden');
      if (invoiceSection) invoiceSection.classList.add('hidden');
      if (paymentFooter) paymentFooter.classList.add('hidden');
    } else if (status === 'checking') {
      // 對帳中模式：顯示對帳中狀態，隱藏所有操作
      bankAccountCard.classList.add('hidden');
      statusUnpaid.classList.add('hidden');
      statusPaid.classList.add('hidden');
      if (statusChecking) statusChecking.classList.remove('hidden');
      invoiceDetail.classList.add('hidden');
      if (transferAccountSection) transferAccountSection.classList.add('hidden');
      if (transferRemarkSection) transferRemarkSection.classList.add('hidden');
      if (invoiceSection) invoiceSection.classList.add('hidden');
      if (paymentFooter) paymentFooter.classList.add('hidden');
    } else {
      // 未繳款模式：顯示轉帳帳戶資訊與發票選擇
      bankAccountCard.classList.add('hidden');
      statusUnpaid.classList.remove('hidden');
      statusPaid.classList.add('hidden');
      if (statusChecking) statusChecking.classList.add('hidden');
      invoiceDetail.classList.add('hidden');
      if (transferAccountSection) transferAccountSection.classList.remove('hidden');
      if (transferRemarkSection) transferRemarkSection.classList.remove('hidden');
      if (invoiceSection) invoiceSection.classList.remove('hidden');
      if (paymentFooter) paymentFooter.classList.remove('hidden');
    }
  }

  renderByStatus(paymentStatus);

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care-payment.html';
      }
    });
  }

  // --- 支付方式 Radio 選項互動（已移除，改為轉帳模式） ---

  // --- 發票類型選擇邏輯 ---
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
        var companyNameInput = document.getElementById('companyName');
        if (taxIdInput && setting.taxId) taxIdInput.value = setting.taxId;
        if (companyNameInput && setting.companyName) companyNameInput.value = setting.companyName;
      }

      // 同步顯示輸入區
      toggleInvoiceAreas();
    } catch (e) {
      console.warn('讀取會員發票設定失敗', e);
    }
  }

  loadMemberInvoiceSetting();

  // --- 我已轉帳完成按鈕 ---
  if (btnTransferDone) {
    btnTransferDone.addEventListener('click', function () {
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

      // 取得轉帳後五碼備註
      var remarkInput = document.getElementById('transferRemark');
      var remarkVal = remarkInput ? remarkInput.value.trim() : '';

      if (!remarkVal) {
        alert('請輸入轉帳後五碼');
        if (remarkInput) remarkInput.focus();
        return;
      }

      if (!/^\d{5}$/.test(remarkVal)) {
        alert('轉帳後五碼須為 5 位數字');
        if (remarkInput) remarkInput.focus();
        return;
      }

      console.log('綠海養護轉帳確認資訊：', {
        transferLastFive: remarkVal,
        invoice: invoiceData
      });

      // 切換狀態為「對帳中」
      paymentStatus = 'checking';
      renderByStatus('checking');

      alert('已送出轉帳確認，目前狀態為「對帳中」');
    });
  }

  // --- 確認離開按鈕：返回上一頁 ---
  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      window.history.back();
    });
  }

});
