/* ============================================
   房屋健檢頁面互動邏輯
   根據 Figma 設計稿 (node-id: 248:1986)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnReserve = document.getElementById('btnReserve');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }

  // --- 線上預約按鈕 ---
  if (btnReserve) {
    btnReserve.addEventListener('click', function () {
      // 導向房屋健檢預約頁面
      window.location.href = 'crm-house-checkup-reserve.html';
    });
  }

  // --- 卡片操作按鈕事件委派 ---
  var cardList = document.querySelector('.card-list');
  if (cardList) {
    cardList.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;

      var action = target.getAttribute('data-action');
      var card = target.closest('.service-card');

      switch (action) {
        case 'view-record':
          // 依狀態導向不同頁面：已完成→檢視紀錄，處理中→聯絡專員
          if (card) {
            var caseNumber = card.querySelector('.card-number');
            var caseId = caseNumber ? caseNumber.textContent.trim() : '';
            var status = card.getAttribute('data-status') || '';
            if (status === '已完成') {
              window.location.href = 'crm-house-checkup-record.html?caseId=' + encodeURIComponent(caseId);
            } else {
              window.location.href = 'crm-house-checkup-contact.html?caseId=' + encodeURIComponent(caseId);
            }
          }
          break;

        case 'survey':
          // 導向滿意度問卷頁面
          if (card) {
            var caseNum = card.querySelector('.card-number');
            var id = caseNum ? caseNum.textContent.trim() : '';
            window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(id) + '&type=' + encodeURIComponent('房屋健檢');
          }
          break;
      }
    });
  }

});
