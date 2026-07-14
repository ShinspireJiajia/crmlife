/* ============================================
   驗屋服務列表頁互動邏輯
   根據 Figma 設計稿 (node-id: 301:548)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 服務狀態設定 ---
  // serviceOpen: 服務是否已開放（true = 已開放可預約，false = 尚未開放）
  var serviceOpen = true;

  // --- DOM 元素 ---
  var stateLocked = document.getElementById('stateLocked');
  var stateEmpty = document.getElementById('stateEmpty');
  var stateHasRecords = document.getElementById('stateHasRecords');
  var cardList = stateHasRecords ? stateHasRecords.querySelector('.card-list') : null;

  // --- 從 localStorage 載入新建立的卡片 ---
  var pendingCards = JSON.parse(localStorage.getItem('crmInspectionCards') || '[]');
  if (pendingCards.length > 0 && cardList) {
    pendingCards.forEach(function (card) {
      var cardHtml = '<div class="service-card" data-sort-date="' + card.sortDate + '" data-status="' + card.status + '">' +
        '<div class="card-header">' +
          '<span class="status-badge status-pending">' + card.status + '</span>' +
          '<span class="card-number">' + card.caseId + '</span>' +
        '</div>' +
        '<div class="card-info">' +
          '<p><span class="label">建　　案</span>｜' + card.project + ' (' + card.unit + ')</p>' +
          '<p><span class="label">預約日期</span>｜' + card.date + ' ' + card.time + '</p>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="btn btn-outline" data-action="view-record">檢視紀錄</button>' +
        '</div>' +
      '</div>';
      cardList.insertAdjacentHTML('beforeend', cardHtml);
    });
    // 清除已讀取的暫存資料
    localStorage.removeItem('crmInspectionCards');
  }

  // --- 計算卡片數量以判斷是否有紀錄 ---
  var totalCards = cardList ? cardList.querySelectorAll('.service-card').length : 0;

  // --- 根據狀態切換顯示 ---
  if (totalCards > 0) {
    // 狀態三：有紀錄 → 顯示卡片列表
    stateHasRecords.style.display = 'flex';
  } else if (serviceOpen) {
    // 狀態二：已開放但無紀錄 → 顯示空狀態 + 預約按鈕
    stateEmpty.style.display = 'flex';
  } else {
    // 狀態一：尚未開放且無紀錄 → 顯示鎖定提示
    stateLocked.style.display = 'block';
  }

  // --- 依預約日期排序卡片（近到遠） ---
  if (cardList && totalCards > 0) {
    var cards = Array.prototype.slice.call(cardList.querySelectorAll('.service-card'));
    cards.forEach(function (card) {
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
    cards.sort(function (a, b) {
      var dateA = a.getAttribute('data-sort-date') || '';
      var dateB = b.getAttribute('data-sort-date') || '';
      return dateB.localeCompare(dateA);
    });
    cards.forEach(function (card) {
      cardList.appendChild(card);
    });
  }

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  // --- 預約驗屋服務按鈕 ---
  var btnReserve = document.getElementById('btnReserve');
  var btnReserveEmpty = document.getElementById('btnReserveEmpty');

  function goToReserve() {
    window.location.href = 'crm-inspection-reserve.html';
  }

  if (btnReserve) {
    btnReserve.addEventListener('click', goToReserve);
  }
  if (btnReserveEmpty) {
    btnReserveEmpty.addEventListener('click', goToReserve);
  }

  // --- 卡片按鈕事件代理 ---
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;

    var action = btn.getAttribute('data-action');
    var card = btn.closest('.service-card');
    var status = card ? card.getAttribute('data-status') : '';

    switch (action) {
      case 'view-record':
        // 根據狀態跳轉不同紀錄頁面
        if (status === '已完成') {
          window.location.href = 'crm-inspection-record.html?status=completed';
        } else {
          window.location.href = 'crm-inspection-record.html?status=processing';
        }
        break;

      case 'survey':
        // 滿意度問卷（已完成的案件才有）
        window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(caseId) + '&type=' + encodeURIComponent('驗屋');
        break;

      case 'contact':
        // 聯絡專員
        alert('即將跳轉至聯絡專員頁面');
        break;
    }
  });

});
