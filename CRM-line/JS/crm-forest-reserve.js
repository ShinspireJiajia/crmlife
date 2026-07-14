/* ============================================
   森林聚落報名預約頁面互動邏輯
   根據 Figma 設計稿
   付費版 node-id: 1:4606
   免費版 node-id: 197:1813
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- 基金會活動場次 Mock 資料 ---
   * capacity: 人數上限, registered: 已報名人數
   * 剩餘名額 = capacity - registered
   * ------------------------------------ */
  var foundationSessions = {
    'foundation-nature-sound': [
      { session_id: 'FS-001', activity_time: '2026.07.05(六) 14:30-16:00', capacity: 40, registered: 38 },
      { session_id: 'FS-002', activity_time: '2026.07.12(六) 14:30-16:00', capacity: 40, registered: 40 },
      { session_id: 'FS-003', activity_time: '2026.07.19(六) 14:30-16:00', capacity: 40, registered: 20 }
    ],
    'foundation-fern-class': [
      { session_id: 'FS-004', activity_time: '2026.07.06(日) 10:00-12:00', capacity: 30, registered: 30 }
    ]
  };

  /* --- Mock 活動資料 --- */
  var eventData = {
    'event-forest': {
      image: 'assets/event-image-forest.png',
      title: '打開植深館｜Into the Forest Living',
      date: '2025/12/05 - 2026/03/31',
      location: '陸府植深館1',
      unitPrice: 600,
      priceLabel: '＄600元 / 人',
      isFree: false,
      maxCount: 2,
      notice: '一戶僅可報名 2 位'
    },
    'event-nature': {
      image: 'assets/event-image-nature.png',
      title: '人．造自然',
      date: '2025/12/05 - 2026/03/31',
      location: '陸府植深館1',
      unitPrice: 0,
      priceLabel: '免費 / 人',
      isFree: true,
      maxCount: 2,
      notice: '一戶僅可報名 2 位'
    },
    'event-nature-free': {
      image: 'assets/event-image-nature.png',
      title: '人．造自然',
      date: '2025/12/05 - 2026/03/31',
      location: '陸府植深館1',
      unitPrice: 0,
      priceLabel: '免費 / 人',
      isFree: true,
      maxCount: 2,
      notice: '一戶僅可報名 2 位'
    },
    'foundation-nature-sound': {
      image: 'assets/event-image-forest.png',
      title: '聆聽寂靜：追尋自然聲景',
      date: '2026.07.05 - 2026.07.19',
      location: '植深館',
      unitPrice: 200,
      priceLabel: '＄200元 / 人',
      isFree: false,
      maxCount: 2,
      notice: '一戶僅可報名 2 位'
    },
    'foundation-fern-class': {
      image: 'assets/event-image-nature.png',
      title: '植蕨系．蕨類上板教學',
      date: '2026.07.06',
      location: '植深館',
      unitPrice: 0,
      priceLabel: '免費 / 人',
      isFree: true,
      maxCount: 2,
      notice: '一戶僅可報名 2 位'
    }
  };

  /* --- DOM 元素取得 --- */
  var btnBack = document.getElementById('btnBack');
  var btnHome = document.getElementById('btnHome');
  var btnSubmit = document.getElementById('btnSubmit');
  var reserveImage = document.getElementById('reserveImage');
  var reserveTitle = document.getElementById('reserveTitle');
  var reserveDate = document.getElementById('reserveDate');
  var reserveLocation = document.getElementById('reserveLocation');
  var reservePrice = document.getElementById('reservePrice');
  var reserveNotice = document.getElementById('reserveNotice');
  var reserveCount = document.getElementById('reserveCount');
  var receiptGroup = document.getElementById('receiptGroup');
  var summaryUnitPrice = document.getElementById('summaryUnitPrice');
  var summaryTotalRow = document.getElementById('summaryTotalRow');
  var summaryTotal = document.getElementById('summaryTotal');

  /* --- 取得 URL 參數中的活動 ID --- */
  var urlParams = new URLSearchParams(window.location.search);
  var eventId = urlParams.get('id') || 'event-forest';

  /* --- 根據活動 ID 載入資料 --- */
  var currentEvent = eventData[eventId];
  if (currentEvent) {
    renderReservation(currentEvent);
  }

  /**
   * 根據活動資料渲染預約頁面
   * @param {Object} event - 活動資料物件
   */
  function renderReservation(event) {
    // 設定活動圖片
    if (reserveImage) {
      reserveImage.src = event.image;
      reserveImage.alt = event.title;
    }

    // 設定活動名稱
    if (reserveTitle) {
      reserveTitle.textContent = event.title;
    }

    // 設定日期
    if (reserveDate) {
      reserveDate.textContent = event.date;
    }

    // 設定地點
    if (reserveLocation) {
      reserveLocation.textContent = event.location;
    }

    // 設定費用
    if (reservePrice) {
      reservePrice.textContent = event.priceLabel;
    }

    // 設定限制提示
    if (reserveNotice) {
      reserveNotice.textContent = event.notice;
    }

    // 設定報名人數下拉選單選項
    if (reserveCount) {
      reserveCount.innerHTML = '';
      for (var i = 1; i <= event.maxCount; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === event.maxCount) {
          option.selected = true;
        }
        reserveCount.appendChild(option);
      }
    }

    // 依據是否免費，控制收據選項顯示
    if (receiptGroup) {
      receiptGroup.style.display = event.isFree ? 'none' : '';
    }

    // 設定費用摘要
    if (event.isFree) {
      // 免費：僅顯示「報名費用 - 免費」
      if (summaryUnitPrice) {
        summaryUnitPrice.textContent = '免費';
      }
      if (summaryTotalRow) {
        summaryTotalRow.style.display = 'none';
      }
    } else {
      // 付費：顯示單價與共計
      if (summaryUnitPrice) {
        summaryUnitPrice.textContent = event.priceLabel;
      }
      if (summaryTotalRow) {
        summaryTotalRow.style.display = '';
      }
      updateTotal(event);
    }
  }

  /**
   * 更新付費活動的共計金額
   * @param {Object} event - 活動資料物件
   */
  function updateTotal(event) {
    if (!reserveCount || !summaryTotal || event.isFree) return;
    var count = parseInt(reserveCount.value, 10) || 1;
    var total = event.unitPrice * count;
    summaryTotal.textContent = '＄' + total + ' 元';
  }

  /* --- 返回按鈕 --- */
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  /* --- 首頁按鈕 --- */
  if (btnHome) {
    btnHome.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'crm-index.html';
    });
  }

  /* --- 場次選擇 Overlay 邏輯 --- */
  var sessionPickerOverlay = document.getElementById('sessionPickerOverlay');
  var sessionPickerList    = document.getElementById('sessionPickerList');
  var sessionPickerError   = document.getElementById('sessionPickerError');
  var sessionPickerConfirm = document.getElementById('sessionPickerConfirm');
  var sessionPickerClose   = document.getElementById('sessionPickerClose');
  var selectedSessionId    = null;

  function isFoundationEvent(id) {
    return id && id.indexOf('foundation-') === 0;
  }

  function getRemaining(s) {
    return s.capacity - s.registered;
  }

  function renderSessionPicker() {
    var sessions = foundationSessions[eventId] || [];
    selectedSessionId = null;
    sessionPickerError.textContent = '';
    sessionPickerConfirm.disabled = true;

    if (sessions.length === 0) {
      sessionPickerList.innerHTML =
        '<p style="text-align:center;color:#999;padding:24px 0;font-size:15px;">目前無開放場次</p>';
      return;
    }

    sessionPickerList.innerHTML = sessions.map(function (s, idx) {
      var remaining = getRemaining(s);
      var isFull = remaining <= 0;
      var slotsClass = isFull ? 'session-slots-full'
                     : remaining <= 5 ? 'session-slots-low'
                     : 'session-slots-ok';
      var slotsText = isFull ? '已額滿' : '剩餘 ' + remaining + ' 位';
      return (
        '<div class="session-item' + (isFull ? ' is-full' : '') + '" ' +
             'data-session-id="' + s.session_id + '" ' +
             'data-remaining="' + remaining + '"' +
             (isFull ? '' : ' role="button" tabindex="0"') + '>' +
          '<div class="session-radio"></div>' +
          '<div class="session-info">' +
            '<span class="session-seq">場次 ' + (idx + 1) + '</span>' +
            '<span class="session-time">' + s.activity_time + '</span>' +
          '</div>' +
          '<span class="session-slots ' + slotsClass + '">' + slotsText + '</span>' +
        '</div>'
      );
    }).join('');

    // 綁定場次點擊
    var items = sessionPickerList.querySelectorAll('.session-item:not(.is-full)');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        sessionPickerList.querySelectorAll('.session-item').forEach(function (el) {
          el.classList.remove('is-selected');
        });
        item.classList.add('is-selected');
        selectedSessionId = item.getAttribute('data-session-id');
        validateSessionSelection();
      });
    });
  }

  function validateSessionSelection() {
    sessionPickerError.textContent = '';
    if (!selectedSessionId) {
      sessionPickerConfirm.disabled = true;
      return;
    }
    var sessions = foundationSessions[eventId] || [];
    var s = null;
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].session_id === selectedSessionId) { s = sessions[i]; break; }
    }
    if (!s) { sessionPickerConfirm.disabled = true; return; }

    var count = parseInt(reserveCount ? reserveCount.value : '1', 10) || 1;
    var remaining = getRemaining(s);
    if (remaining < count) {
      sessionPickerError.textContent = '此場次剩餘名額（' + remaining + ' 位）不足您的報名人數（' + count + ' 位）';
      sessionPickerConfirm.disabled = true;
    } else {
      sessionPickerConfirm.disabled = false;
    }
  }

  function openSessionPicker() {
    renderSessionPicker();
    sessionPickerOverlay.classList.add('is-open');
  }

  function closeSessionPicker() {
    sessionPickerOverlay.classList.remove('is-open');
  }

  if (sessionPickerClose) {
    sessionPickerClose.addEventListener('click', closeSessionPicker);
  }
  if (sessionPickerOverlay) {
    sessionPickerOverlay.addEventListener('click', function (e) {
      if (e.target === sessionPickerOverlay) closeSessionPicker();
    });
  }

  if (sessionPickerConfirm) {
    sessionPickerConfirm.addEventListener('click', function () {
      if (!selectedSessionId) return;
      closeSessionPicker();
      proceedAfterSession(selectedSessionId);
    });
  }

  // 人數變更時重新驗證
  if (reserveCount) {
    reserveCount.addEventListener('change', function () {
      if (currentEvent && !currentEvent.isFree) updateTotal(currentEvent);
      if (selectedSessionId) validateSessionSelection();
    });
  }

  function proceedAfterSession(sessionId) {
    var count = parseInt(reserveCount ? reserveCount.value : '1', 10) || 1;
    var receiptValue = '';
    if (!currentEvent.isFree) {
      var checkedRadio = document.querySelector('input[name="receipt"]:checked');
      receiptValue = checkedRadio ? checkedRadio.value : 'no';
    }
    var reservationData = {
      eventId: eventId,
      sessionId: sessionId,
      title: currentEvent.title,
      count: count,
      isFree: currentEvent.isFree,
      total: currentEvent.isFree ? 0 : currentEvent.unitPrice * count,
      receipt: receiptValue
    };
    // eslint-disable-next-line no-console
    console.log('預約資料：', reservationData);

    if (!currentEvent.isFree) {
      window.location.href = 'crm-forest-payment.html?id=' + encodeURIComponent(eventId) +
                              '&session=' + encodeURIComponent(sessionId);
      return;
    }
    alert('已提交預約！');
  }

  /* --- 確認提交預約按鈕 --- */
  if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {
      if (!currentEvent) return;

      // 基金會活動：先選場次再提交
      if (isFoundationEvent(eventId)) {
        openSessionPicker();
        return;
      }

      // 一般活動：原有流程
      var count = parseInt(reserveCount.value, 10) || 1;
      var receiptValue = '';
      if (!currentEvent.isFree) {
        var checkedRadio = document.querySelector('input[name="receipt"]:checked');
        receiptValue = checkedRadio ? checkedRadio.value : 'no';
      }
      var reservationData = {
        eventId: eventId,
        title: currentEvent.title,
        count: count,
        isFree: currentEvent.isFree,
        total: currentEvent.isFree ? 0 : currentEvent.unitPrice * count,
        receipt: receiptValue
      };
      // eslint-disable-next-line no-console
      console.log('預約資料：', reservationData);
      if (!currentEvent.isFree) {
        window.location.href = 'crm-forest-payment.html?id=' + encodeURIComponent(eventId);
        return;
      }
      alert('已提交預約！');
    });
  }

});
