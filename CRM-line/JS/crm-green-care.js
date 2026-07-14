/* ============================================
   綠海養護頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:3110)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnHome = document.getElementById('btnHome');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      // 返回上一頁
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index.html';
      }
    });
  }

  // --- 操作按鈕事件委派 ---
  var mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.addEventListener('click', function (e) {
      // 找到最近的 .btn-action 按鈕
      var btn = e.target.closest('.btn-action');
      if (!btn) return;

      var action = btn.getAttribute('data-action');
      // 取得所屬卡片的合約資訊
      var card = btn.closest('.contract-card');
      var contractTitle = card ? card.querySelector('.card-title').textContent : '';

      switch (action) {
        case 'contract-info':
          // 導航至合約資訊頁面，帶入合約狀態
          var status = card ? card.getAttribute('data-status') : 'pending';
          window.location.href = 'crm-green-care-contract.html?status=' + status;
          break;
        case 'reserve-service':
          // 導航至預約服務表單頁面
          window.location.href = 'crm-green-care-reserve.html';
          break;
        case 'reserve-record':
          // 導航至預約紀錄頁面
          window.location.href = 'crm-green-care-record.html';
          break;
        case 'payment-info':
          // 導航至繳費資訊頁面
          window.location.href = 'crm-green-care-payment.html';
          break;
        default:
          break;
      }
    });
  }

});
