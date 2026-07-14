/* ============================================
   款項明細頁面互動邏輯
   根據 URL 參數 id 載入對應款項資料
   顯示已付款 / 未繳款兩種不同狀態
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mock 資料 ---
  var paymentItems = {
    pay001: {
      code: '001',
      name: '訂金',
      amount: 2980000,
      payDate: '2025/01/06',
      status: 'paid',
      bankAccount: '7109-4521-3258',
      invoiceDate: '114年01-02月',
      invoiceNumber: 'TN 61433573',
      invoiceMethod: 'barcode',
      invoiceBarcode: '/1234ABC'
    },
    pay002: {
      code: '002',
      name: '簽約金',
      amount: 5970000,
      payDate: '2025/01/06',
      status: 'paid',
      bankAccount: '7109-4521-3258',
      invoiceDate: '114年01-02月',
      invoiceNumber: 'TN 61433574',
      invoiceMethod: 'barcode',
      invoiceBarcode: '/1234ABC'
    },
    pay003: {
      code: '003',
      name: '開工款',
      amount: 2980000,
      payDate: '',
      status: 'unpaid',
      bankAccount: '7109-4521-3258',
      invoiceDate: '',
      invoiceNumber: '',
      invoiceMethod: 'none',
      invoiceBarcode: ''
    },
    pay004: {
      code: '004',
      name: '交屋尾款',
      amount: 11000000,
      payDate: '',
      status: 'unpaid',
      bankAccount: '7109-4521-3258',
      invoiceDate: '',
      invoiceNumber: '',
      invoiceMethod: 'none',
      invoiceBarcode: ''
    }
  };

  // --- 取得 URL 參數 ---
  var urlParams = new URLSearchParams(window.location.search);
  var paymentId = urlParams.get('id') || 'pay001';

  // --- DOM 元素 ---
  var mainContent = document.getElementById('mainContent');

  // --- 格式化金額 ---
  function formatAmount(num) {
    return '＄' + num.toLocaleString('en-US');
  }

  // --- 渲染頁面 ---
  function renderDetail() {
    var data = paymentItems[paymentId];
    if (!data) {
      mainContent.innerHTML = '<p style="text-align:center;padding:40px;color:#3a4246;">找不到款項資料</p>';
      return;
    }

    var isPaid = data.status === 'paid';
    var statusClass = isPaid ? 'status-paid' : 'status-unpaid';
    var statusText = isPaid ? '已付款' : '未繳款';
    var dateText = data.payDate || '';
    var invoiceDateDisplay = data.invoiceDate || '-';
    var invoiceNumberDisplay = data.invoiceNumber || '-';

    var html = '';

    // 帳號資訊卡片
    html += '<div class="bank-info-card">' +
      '<div class="bank-label-group">' +
        '<svg class="bank-icon" width="20" height="14" viewBox="0 0 20 14" fill="none">' +
          '<rect x="0" y="0" width="20" height="14" rx="2" stroke="#3a4246" stroke-width="2" fill="none"/>' +
          '<line x1="0" y1="5" x2="20" y2="5" stroke="#3a4246" stroke-width="3"/>' +
          '<text x="2" y="12" font-size="6" font-weight="bold" fill="#b8a676">BANK</text>' +
        '</svg>' +
        '<span class="bank-label">帳號</span>' +
      '</div>' +
      '<span class="bank-value">' + data.bankAccount + '</span>' +
    '</div>';

    // 款項明細主卡片
    html += '<div class="detail-card">';

    // 標題列
    html += '<div class="detail-header">' +
      '<p class="detail-title">' + data.code + ' / ' + data.name + '</p>' +
    '</div>';

    // 金額列
    html += '<div class="detail-amount-row">' +
      '<span class="detail-amount-label">應繳金額</span>' +
      '<span class="detail-amount-value">' + formatAmount(data.amount) + '</span>' +
    '</div>';

    // 繳款日期 / 狀態列
    html += '<div class="detail-date-row">' +
      '<span class="detail-date-text">繳款日期 ' + dateText + '</span>' +
      '<span class="detail-status ' + statusClass + '">' + statusText + '</span>' +
    '</div>';

    // 發票資訊
    html += '<div class="invoice-info">' +
      '<div class="invoice-row">' +
        '<span class="invoice-row-label">發票開立日期</span>' +
        '<span class="invoice-row-value">' + invoiceDateDisplay + '</span>' +
      '</div>' +
      '<div class="invoice-row">' +
        '<span class="invoice-row-label">發票號碼</span>' +
        '<span class="invoice-row-value">' + invoiceNumberDisplay + '</span>' +
      '</div>' +
    '</div>';

    html += '</div>'; // /detail-card

    // 發票方式區塊
    html += '<div class="invoice-method-section">' +
      '<div class="invoice-method-title">' +
        '<svg class="section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">' +
          '<rect x="3" y="2" width="18" height="20" rx="2" stroke="#3a4246" stroke-width="1.5" fill="none"/>' +
          '<line x1="7" y1="7" x2="17" y2="7" stroke="#3a4246" stroke-width="1.5"/>' +
          '<line x1="7" y1="11" x2="17" y2="11" stroke="#3a4246" stroke-width="1.5"/>' +
          '<line x1="7" y1="15" x2="13" y2="15" stroke="#3a4246" stroke-width="1.5"/>' +
        '</svg>' +
        '<span>發票方式</span>' +
      '</div>';

    // 發票方式內容
    if (isPaid && data.invoiceMethod === 'barcode') {
      html += '<div class="invoice-method-card">' +
        '<div class="invoice-method-text">' +
          '手機條碼' +
          '<span class="barcode-value">' + data.invoiceBarcode + '</span>' +
        '</div>' +
      '</div>';
    } else {
      html += '<div class="invoice-method-card">' +
        '<p class="invoice-method-text">尚未開立</p>' +
      '</div>';
    }

    html += '</div>'; // /invoice-method-section

    mainContent.innerHTML = html;
  }

  // --- 初始渲染 ---
  renderDetail();

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-unit-detail.html?tab=payment';
      }
    });
  }

});
