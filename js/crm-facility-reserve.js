/* ============================================
   公設預約頁面互動邏輯
   社區公共設施（健身房、KTV、會議室、游泳池）線上預約、
   點數扣除與門禁 QR Code 憑證
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mock 設施資料 ---
   * pointsPerHour: 每小時所需點數
   * slots: 今日開放時段（capacity 為可容納組數／人數，booked 為目前已預約數）
   * ------------------------------------ */
  var facilityData = {
    gym: {
      name: '健身房',
      emoji: '🏋️',
      location: '社區地下一樓 B1',
      hours: '06:00 - 22:00',
      pointsPerHour: 10,
      maxPeople: 4,
      notice: '每次預約以 1 小時為單位，同戶每日至多預約 2 個時段。',
      slots: [
        { time: '06:00 - 07:00', capacity: 8, booked: 3 },
        { time: '07:00 - 08:00', capacity: 8, booked: 8 },
        { time: '17:00 - 18:00', capacity: 8, booked: 6 },
        { time: '18:00 - 19:00', capacity: 8, booked: 2 },
        { time: '19:00 - 20:00', capacity: 8, booked: 0 },
        { time: '20:00 - 21:00', capacity: 8, booked: 5 }
      ]
    },
    ktv: {
      name: 'KTV 包廂',
      emoji: '🎤',
      location: '社區交誼廳 2 樓',
      hours: '10:00 - 24:00',
      pointsPerHour: 20,
      maxPeople: 8,
      notice: '共 2 間包廂，每次預約以 2 小時為單位。',
      slots: [
        { time: '10:00 - 12:00', capacity: 2, booked: 0 },
        { time: '14:00 - 16:00', capacity: 2, booked: 1 },
        { time: '16:00 - 18:00', capacity: 2, booked: 2 },
        { time: '19:00 - 21:00', capacity: 2, booked: 2 },
        { time: '21:00 - 23:00', capacity: 2, booked: 0 }
      ]
    },
    meeting: {
      name: '會議室',
      emoji: '💼',
      location: '社區行政中心 1 樓',
      hours: '08:00 - 21:00',
      pointsPerHour: 15,
      maxPeople: 12,
      notice: '僅 1 間會議室，可容納 12 人，每次預約以 1 小時為單位。',
      slots: [
        { time: '09:00 - 10:00', capacity: 1, booked: 0 },
        { time: '10:00 - 11:00', capacity: 1, booked: 1 },
        { time: '13:00 - 14:00', capacity: 1, booked: 0 },
        { time: '15:00 - 16:00', capacity: 1, booked: 1 },
        { time: '19:00 - 20:00', capacity: 1, booked: 0 }
      ]
    },
    pool: {
      name: '游泳池',
      emoji: '🏊',
      location: '社區戶外庭院',
      hours: '07:00 - 21:00（12:00-13:00 清潔維護，暫停開放）',
      pointsPerHour: 5,
      maxPeople: 4,
      notice: '每人限量入場，請自備泳帽並遵守救生員現場指示。',
      slots: [
        { time: '07:00 - 09:00', capacity: 20, booked: 9 },
        { time: '09:00 - 11:00', capacity: 20, booked: 20 },
        { time: '14:00 - 16:00', capacity: 20, booked: 12 },
        { time: '16:00 - 18:00', capacity: 20, booked: 5 },
        { time: '18:00 - 20:00', capacity: 20, booked: 17 }
      ]
    }
  };

  /* --- 使用者可用點數（Mock，示意用；實際串接 API 時改為後端回傳） --- */
  var pointsBalance = 320;

  /* --- 我的預約紀錄（Mock） --- */
  var bookings = [
    {
      id: 'FR20260705-002',
      facilityKey: 'pool',
      facilityName: '游泳池',
      date: '2026/07/05',
      slot: '16:00 - 18:00',
      people: 2,
      points: 10,
      status: 'completed'
    }
  ];
  var bookingSeq = 3;

  /* --- DOM 元素取得 --- */
  var pointsBalanceEl = document.getElementById('pointsBalance');
  var facilityTabs = document.getElementById('facilityTabs');
  var facilityGrid = document.getElementById('facilityGrid');
  var bookingList = document.getElementById('bookingList');
  var bookingEmptyState = document.getElementById('bookingEmptyState');

  var facilityModalOverlay = document.getElementById('facilityModalOverlay');
  var facilityModalClose = document.getElementById('facilityModalClose');
  var modalFacilityEmoji = document.getElementById('modalFacilityEmoji');
  var modalFacilityName = document.getElementById('modalFacilityName');
  var modalFacilityLocation = document.getElementById('modalFacilityLocation');
  var modalFacilityNotice = document.getElementById('modalFacilityNotice');
  var bookDate = document.getElementById('bookDate');
  var slotGrid = document.getElementById('slotGrid');
  var bookPeople = document.getElementById('bookPeople');
  var summaryUnitPoints = document.getElementById('summaryUnitPoints');
  var summaryHours = document.getElementById('summaryHours');
  var summaryTotalPoints = document.getElementById('summaryTotalPoints');
  var summaryBalanceBefore = document.getElementById('summaryBalanceBefore');
  var summaryBalanceAfter = document.getElementById('summaryBalanceAfter');
  var insufficientMsg = document.getElementById('insufficientMsg');
  var btnFacilitySubmit = document.getElementById('btnFacilitySubmit');

  var successModalOverlay = document.getElementById('successModalOverlay');
  var successModalClose = document.getElementById('successModalClose');
  var btnSuccessConfirm = document.getElementById('btnSuccessConfirm');
  var successOrderNo = document.getElementById('successOrderNo');
  var successFacility = document.getElementById('successFacility');
  var successDate = document.getElementById('successDate');
  var successSlot = document.getElementById('successSlot');
  var successPeople = document.getElementById('successPeople');
  var successPoints = document.getElementById('successPoints');
  var qrGrid = document.getElementById('qrGrid');

  var currentFacilityKey = null;
  var selectedSlotIndex = null;

  /* --- 點數餘額顯示更新 --- */
  function renderPointsBalance() {
    if (pointsBalanceEl) pointsBalanceEl.textContent = pointsBalance;
  }
  renderPointsBalance();

  /* --- 今天日期字串（yyyy-mm-dd，供 date input 預設值與 min 使用） --- */
  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /* --- 解析時段字串取得小時數，例如 "10:00 - 12:00" → 2 --- */
  function parseSlotHours(timeStr) {
    var parts = timeStr.split(' - ');
    var start = parts[0].split(':');
    var end = parts[1].split(':');
    var startMin = parseInt(start[0], 10) * 60 + parseInt(start[1], 10);
    var endMin = parseInt(end[0], 10) * 60 + parseInt(end[1], 10);
    return (endMin - startMin) / 60;
  }

  /* ============================================
     分類標籤切換：設施列表 / 我的預約
     ============================================ */
  if (facilityTabs) {
    var tabs = facilityTabs.querySelectorAll('.facility-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var view = tab.getAttribute('data-view');
        if (view === 'list') {
          facilityGrid.style.display = '';
          bookingList.style.display = 'none';
          bookingEmptyState.style.display = 'none';
        } else {
          facilityGrid.style.display = 'none';
          renderBookingList();
        }
      });
    });
  }

  /* ============================================
     我的預約列表渲染
     ============================================ */
  var statusLabelMap = {
    upcoming: '待入場',
    completed: '已完成',
    cancelled: '已取消'
  };

  function renderBookingList() {
    if (!bookingList) return;
    if (bookings.length === 0) {
      bookingList.style.display = 'none';
      bookingEmptyState.style.display = '';
      return;
    }
    bookingEmptyState.style.display = 'none';
    bookingList.style.display = '';
    bookingList.innerHTML = bookings.map(function (b) {
      var actions = '';
      if (b.status === 'upcoming') {
        actions =
          '<div class="booking-card-actions">' +
            '<button class="btn-booking-qr" data-booking-id="' + b.id + '">查看入場憑證</button>' +
            '<button class="btn-booking-cancel" data-booking-id="' + b.id + '">取消預約</button>' +
          '</div>';
      }
      return (
        '<div class="booking-card" data-booking-id="' + b.id + '">' +
          '<div class="booking-card-header">' +
            '<span class="booking-order-no">' + b.id + '</span>' +
            '<span class="booking-status status-' + b.status + '">' + statusLabelMap[b.status] + '</span>' +
          '</div>' +
          '<div class="booking-card-body">' +
            '<p class="booking-info-row"><span class="booking-label">設　　施</span>' + b.facilityName + '</p>' +
            '<p class="booking-info-row"><span class="booking-label">日　　期</span>' + b.date + '</p>' +
            '<p class="booking-info-row"><span class="booking-label">時　　段</span>' + b.slot + '</p>' +
            '<p class="booking-info-row"><span class="booking-label">人　　數</span>' + b.people + ' 人</p>' +
            '<p class="booking-info-row"><span class="booking-label">扣除點數</span>' + b.points + ' 點</p>' +
          '</div>' +
          actions +
        '</div>'
      );
    }).join('');

    // 綁定「查看入場憑證」
    bookingList.querySelectorAll('.btn-booking-qr').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-booking-id');
        var booking = bookings.filter(function (b) { return b.id === id; })[0];
        if (booking) openSuccessModal(booking, '入場憑證');
      });
    });

    // 綁定「取消預約」
    bookingList.querySelectorAll('.btn-booking-cancel').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-booking-id');
        var booking = bookings.filter(function (b) { return b.id === id; })[0];
        if (!booking) return;
        if (!window.confirm('確定要取消此筆公設預約嗎？取消後點數將原路退回。')) return;
        booking.status = 'cancelled';
        pointsBalance += booking.points;
        renderPointsBalance();
        renderBookingList();
      });
    });
  }

  /* ============================================
     開啟預約表單 Modal
     ============================================ */
  function openFacilityModal(facilityKey) {
    var f = facilityData[facilityKey];
    if (!f) return;
    currentFacilityKey = facilityKey;
    selectedSlotIndex = null;

    modalFacilityEmoji.textContent = f.emoji;
    modalFacilityName.textContent = f.name;
    modalFacilityLocation.textContent = f.location + '｜開放時間 ' + f.hours;
    modalFacilityNotice.textContent = f.notice;

    // 日期：預設今天，且不可選過去日期
    bookDate.value = todayStr();
    bookDate.min = todayStr();

    // 使用人數下拉選單
    bookPeople.innerHTML = '';
    for (var i = 1; i <= f.maxPeople; i++) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + ' 人';
      bookPeople.appendChild(opt);
    }

    renderSlotGrid(f);
    updateSummary();

    facilityModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeFacilityModal() {
    facilityModalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function renderSlotGrid(f) {
    slotGrid.innerHTML = f.slots.map(function (s, idx) {
      var remaining = s.capacity - s.booked;
      var isFull = remaining <= 0;
      var isLow = !isFull && remaining <= Math.max(1, Math.ceil(s.capacity * 0.2));
      var stateClass = isFull ? ' is-full' : (isLow ? ' is-low' : '');
      var remainingText = isFull ? '已額滿' : ('剩餘 ' + remaining);
      return (
        '<div class="slot-btn' + stateClass + '" data-slot-index="' + idx + '"' +
             (isFull ? '' : ' role="button" tabindex="0"') + '>' +
          '<span class="slot-time">' + s.time + '</span>' +
          '<span class="slot-remaining">' + remainingText + '</span>' +
        '</div>'
      );
    }).join('');

    slotGrid.querySelectorAll('.slot-btn:not(.is-full)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        slotGrid.querySelectorAll('.slot-btn').forEach(function (el) {
          el.classList.remove('is-selected');
        });
        btn.classList.add('is-selected');
        selectedSlotIndex = parseInt(btn.getAttribute('data-slot-index'), 10);
        updateSummary();
      });
    });
  }

  /* --- 更新點數費用摘要並控制送出按鈕狀態 --- */
  function updateSummary() {
    var f = facilityData[currentFacilityKey];
    if (!f) return;

    summaryUnitPoints.textContent = f.pointsPerHour + ' 點 / 小時';
    summaryBalanceBefore.textContent = pointsBalance + ' 點';

    if (selectedSlotIndex === null) {
      summaryHours.textContent = '-';
      summaryTotalPoints.textContent = '-';
      summaryBalanceAfter.textContent = '-';
      insufficientMsg.style.display = 'none';
      btnFacilitySubmit.disabled = true;
      return;
    }

    var slot = f.slots[selectedSlotIndex];
    var hours = parseSlotHours(slot.time);
    var total = f.pointsPerHour * hours;
    var after = pointsBalance - total;

    summaryHours.textContent = hours + ' 小時';
    summaryTotalPoints.textContent = total + ' 點';
    summaryBalanceAfter.textContent = after + ' 點';

    if (after < 0) {
      insufficientMsg.style.display = '';
      btnFacilitySubmit.disabled = true;
    } else {
      insufficientMsg.style.display = 'none';
      btnFacilitySubmit.disabled = false;
    }
  }

  if (bookPeople) {
    bookPeople.addEventListener('change', updateSummary);
  }

  if (facilityModalClose) facilityModalClose.addEventListener('click', closeFacilityModal);
  if (facilityModalOverlay) {
    facilityModalOverlay.addEventListener('click', function (e) {
      if (e.target === facilityModalOverlay) closeFacilityModal();
    });
  }

  /* --- 設施卡片：立即預約按鈕 --- */
  if (facilityGrid) {
    facilityGrid.querySelectorAll('.facility-card').forEach(function (card) {
      var btn = card.querySelector('.btn-facility-book');
      var key = card.getAttribute('data-facility');
      if (btn) {
        btn.addEventListener('click', function () {
          openFacilityModal(key);
        });
      }
    });
  }

  /* ============================================
     送出預約：扣除點數、更新名額、產生憑證
     ============================================ */
  if (btnFacilitySubmit) {
    btnFacilitySubmit.addEventListener('click', function () {
      if (selectedSlotIndex === null || !currentFacilityKey) return;
      var f = facilityData[currentFacilityKey];
      var slot = f.slots[selectedSlotIndex];
      var hours = parseSlotHours(slot.time);
      var total = f.pointsPerHour * hours;
      var people = parseInt(bookPeople.value, 10) || 1;
      var dateValue = bookDate.value || todayStr();
      var dateDisplay = dateValue.replace(/-/g, '/');

      // 扣點與名額更新
      pointsBalance -= total;
      slot.booked += 1;
      renderPointsBalance();

      // 產生預約紀錄
      var idNum = String(bookingSeq++).padStart(3, '0');
      var booking = {
        id: 'FR' + dateValue.replace(/-/g, '') + '-' + idNum,
        facilityKey: currentFacilityKey,
        facilityName: f.name,
        date: dateDisplay,
        slot: slot.time,
        people: people,
        points: total,
        status: 'upcoming'
      };
      bookings.unshift(booking);

      closeFacilityModal();
      openSuccessModal(booking, '預約成功');
    });
  }

  /* ============================================
     預約成功／入場憑證 Modal
     ============================================ */
  function openSuccessModal(booking, title) {
    document.getElementById('successTitle').textContent = title;
    successOrderNo.textContent = '預約編號：' + booking.id;
    successFacility.textContent = booking.facilityName;
    successDate.textContent = booking.date;
    successSlot.textContent = booking.slot;
    successPeople.textContent = booking.people + ' 人';
    successPoints.textContent = booking.points + ' 點';

    renderFakeQr(booking.id);

    successModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessModal() {
    successModalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
    // 若「設施列表」已不再顯示（表示使用者是從我的預約點開），重新整理清單
    if (facilityGrid && facilityGrid.style.display === 'none') {
      renderBookingList();
    }
  }

  if (successModalClose) successModalClose.addEventListener('click', closeSuccessModal);
  if (btnSuccessConfirm) btnSuccessConfirm.addEventListener('click', closeSuccessModal);
  if (successModalOverlay) {
    successModalOverlay.addEventListener('click', function (e) {
      if (e.target === successModalOverlay) closeSuccessModal();
    });
  }

  /**
   * 產生示意用 QR Code 圖樣（依預約編號決定樣式，非真實可掃碼內容）
   * @param {string} seed - 用於決定圖樣的字串（預約編號）
   */
  function renderFakeQr(seed) {
    if (!qrGrid) return;
    var size = 21;
    var html = '';
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        var str = seed + '-' + r + '-' + c;
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        var on = (hash & 1) === 1;
        html += '<span class="qr-cell' + (on ? ' on' : '') + '"></span>';
      }
    }
    qrGrid.innerHTML = html;
  }

});
