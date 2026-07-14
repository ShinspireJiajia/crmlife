/* ============================================
   綠海養護 - 繳費資訊頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:3567)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      // 返回上一頁（綠海養護主頁）
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care.html';
      }
    });
  }

  // --- 繳費卡片點擊事件：導向款項明細頁 ---
  var paymentCards = document.querySelectorAll('.payment-card');
  paymentCards.forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      var statusBadge = card.querySelector('.status-badge');
      if (statusBadge && (statusBadge.classList.contains('status-unpaid') || statusBadge.classList.contains('status-unpaid-overdue'))) {
        // 未繳款：導向未繳款款項明細頁
        window.location.href = 'crm-green-care-payment-detail.html?status=unpaid';
      } else {
        // 已付款：導向已繳款款項明細頁
        window.location.href = 'crm-green-care-payment-detail.html?status=paid';
      }
    });
  });

});
