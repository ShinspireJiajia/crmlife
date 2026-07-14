/* ============================================
   交屋服務頁面互動邏輯
   根據 Figma 設計稿 (node-id: 244:559)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 從 localStorage 載入新建立的卡片 ---
  var cardList = document.querySelector('.card-list');
  var pendingCards = JSON.parse(localStorage.getItem('crmHandoverCards') || '[]');
  if (pendingCards.length > 0 && cardList) {
    pendingCards.forEach(function (card) {
      var cardHtml = '<div class="service-card" data-sort-date="' + card.sortDate + '">' +
        '<div class="card-header">' +
          '<span class="status-badge status-pending">' + card.status + '</span>' +
          '<span class="card-number">' + card.caseId + '</span>' +
        '</div>' +
        '<div class="card-info">' +
          '<p><span class="label">建　　案</span>｜' + card.project + ' (' + card.unit + ')</p>' +
          '<p><span class="label">預約日期</span>｜' + card.date + ' ' + card.time + '</p>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="btn btn-disabled" disabled>檢視紀錄</button>' +
          '<button class="btn btn-gold" data-action="contact">聯絡專員</button>' +
        '</div>' +
      '</div>';
      cardList.insertAdjacentHTML('beforeend', cardHtml);
    });
    // 清除已讀取的暫存資料
    localStorage.removeItem('crmHandoverCards');
  }

  // --- 依預約日期排序卡片（近到遠） ---
  if (cardList) {
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.service-card'));
    cards.forEach(function (card) {
      // 若尚無 data-sort-date，從卡片內容解析
      if (!card.getAttribute('data-sort-date')) {
        var dateP = card.querySelector('.card-info p:last-child');
        if (dateP) {
          var match = dateP.textContent.match(/(\d{4}\/\d{2}\/\d{2})\s*(\d{2}:\d{2})/);
          if (match) {
            card.setAttribute('data-sort-date', match[1].replace(/\//g, '-') + ' ' + match[2]);
          }
        }
      }
    });
    // 排序：日期由近到遠（降冪）
    cards.sort(function (a, b) {
      var dateA = a.getAttribute('data-sort-date') || '';
      var dateB = b.getAttribute('data-sort-date') || '';
      return dateB.localeCompare(dateA);
    });
    // 重新插入排序後的卡片
    cards.forEach(function (card) {
      cardList.appendChild(card);
    });
  }

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      // 返回上一頁
      if (window.history.length > 1) {
        window.history.back();
      }
    });
  }

  // --- 預約交屋服務按鈕 ---
  var btnReserve = document.getElementById('btnReserve');
  if (btnReserve) {
    btnReserve.addEventListener('click', function () {
      // 導向預約交屋服務表單頁
      window.location.href = 'crm-handover-reserve.html';
    });
  }

  // --- 首頁按鈕 ---
  var btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'crm-index.html';
    });
  }

  // --- 卡片操作按鈕事件委派 ---
  if (cardList) {
    cardList.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;

      var action = btn.getAttribute('data-action');
      var card = btn.closest('.service-card');
      var cardNumber = card ? card.querySelector('.card-number') : null;
      var caseId = cardNumber ? cardNumber.textContent.trim() : '';

      switch (action) {
        case 'contact':
          // 聯絡專員
          console.log('聯絡專員，案件編號：' + caseId);
          break;

        case 'view-record':
          // 檢視紀錄 — 帶上狀態參數導向交屋服務檢視紀錄頁面
          var cardStatus = card ? (card.getAttribute('data-status') || '預約中') : '預約中';
          window.location.href = 'crm-handover-record.html?status=' + encodeURIComponent(cardStatus);
          break;

        case 'survey':
          // 滿意度問卷
          window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(caseId) + '&type=' + encodeURIComponent('交屋');
          break;
      }
    });
  }

});
