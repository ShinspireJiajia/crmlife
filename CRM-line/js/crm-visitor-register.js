/* ============================================
   訪客登記頁面互動邏輯
   支援：線上預先登記（產生 QR Code / 通行密碼）、
   通行證詳情檢視、取消登記，以及訪客抵達即時通知（Demo 模擬）。
   資料以 localStorage 模擬後端儲存，重新整理頁面仍會保留。
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var STORAGE_KEY = 'crmVisitorPasses';
  var CURRENT_UNIT = 'A3-3';

  var STATUS_TEXT = { pending: '待到訪', arrived: '已到訪', cancelled: '已取消' };

  var filterTabs = document.querySelectorAll('#visitorFilterTabs .filter-tab');
  var visitorList = document.getElementById('visitorList');
  var emptyState = document.getElementById('visitorEmptyState');

  var btnAddVisitor = document.getElementById('btnAddVisitor');
  var formModalOverlay = document.getElementById('visitorFormModalOverlay');
  var formModalClose = document.getElementById('visitorFormModalClose');
  var visitorForm = document.getElementById('visitorForm');

  var passModalOverlay = document.getElementById('visitorPassModalOverlay');
  var passModalClose = document.getElementById('visitorPassModalClose');
  var passName = document.getElementById('passName');
  var passStatus = document.getElementById('passStatus');
  var passInfoList = document.getElementById('passInfoList');
  var passQrSection = document.getElementById('passQrSection');
  var passQrVisual = document.getElementById('passQrVisual');
  var passCode = document.getElementById('passCode');
  var passActions = document.getElementById('passActions');
  var btnPassShare = document.getElementById('btnPassShare');
  var btnPassCancel = document.getElementById('btnPassCancel');
  var btnPassDemoArrive = document.getElementById('btnPassDemoArrive');

  var toast = document.getElementById('visitorToast');
  var toastTitle = document.getElementById('visitorToastTitle');
  var toastDesc = document.getElementById('visitorToastDesc');

  var currentFilter = 'all';
  var activePassId = null;
  var toastTimer = null;

  /* --- 資料存取 --- */
  function loadPasses() {
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      raw = null;
    }
    if (!raw) {
      var seeded = seedPasses();
      savePasses(seeded);
      return seeded;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      var fallback = seedPasses();
      savePasses(fallback);
      return fallback;
    }
  }

  function savePasses(passes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
    } catch (e) { /* localStorage 不可用時略過持久化 */ }
  }

  function seedPasses() {
    return [
      {
        id: 'V20260713001',
        name: '林先生',
        phone: '0955222111',
        unit: CURRENT_UNIT,
        car: '',
        visitTime: '2026-07-13T09:30',
        note: '裝潢廠商，前來丈量客變尺寸',
        status: 'arrived',
        password: '360214',
        arrivedTime: '2026-07-13T09:35'
      },
      {
        id: 'V20260715002',
        name: '王大明',
        phone: '0912345678',
        unit: CURRENT_UNIT,
        car: 'ABC-1234',
        visitTime: '2026-07-15T14:00',
        note: '親友來訪',
        status: 'pending',
        password: '482913',
        arrivedTime: null
      },
      {
        id: 'V20260709003',
        name: '陳先生',
        phone: '0933888777',
        unit: CURRENT_UNIT,
        car: 'DEF-5678',
        visitTime: '2026-07-09T10:00',
        note: '長照服務人員',
        status: 'cancelled',
        password: '751046',
        arrivedTime: null
      }
    ];
  }

  var passes = loadPasses();

  /* --- 篩選標籤切換 --- */
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderList();
    });
  });

  /* --- 清單渲染（依到訪時間新到舊排序） --- */
  function renderList() {
    var sorted = passes.slice().sort(function (a, b) {
      return new Date(b.visitTime) - new Date(a.visitTime);
    });

    var visible = sorted.filter(function (p) {
      return currentFilter === 'all' || p.status === currentFilter;
    });

    if (visible.length === 0) {
      visitorList.style.display = 'none';
      emptyState.style.display = '';
      return;
    }
    visitorList.style.display = '';
    emptyState.style.display = 'none';

    visitorList.innerHTML = visible.map(function (p) {
      var btnText = p.status === 'pending' ? '查看通行證' : '查看詳情';
      var btnClass = p.status === 'pending' ? 'btn-view-pass' : 'btn-view-pass btn-secondary';
      return (
        '<div class="visitor-card" data-id="' + p.id + '" data-status="' + p.status + '">' +
          '<div class="visitor-card-header">' +
            '<p class="visitor-card-name">' + escapeHtml(p.name) + '</p>' +
            '<div class="visitor-card-status status-' + p.status + '"><span>' + STATUS_TEXT[p.status] + '</span></div>' +
          '</div>' +
          '<div class="visitor-card-info">' +
            '<p><span class="info-label">聯絡電話</span><span class="info-value">｜' + escapeHtml(p.phone) + '</span></p>' +
            '<p><span class="info-label">拜訪戶別</span><span class="info-value">｜' + escapeHtml(p.unit) + '</span></p>' +
            '<p><span class="info-label">車　　號</span><span class="info-value">｜' + (p.car ? escapeHtml(p.car) : '未提供') + '</span></p>' +
            '<p><span class="info-label">來訪時間</span><span class="info-value">｜' + formatDateTime(p.visitTime) + '</span></p>' +
          '</div>' +
          '<button class="' + btnClass + '">' + btnText + '</button>' +
        '</div>'
      );
    }).join('');
  }

  visitorList.addEventListener('click', function (e) {
    var card = e.target.closest('.visitor-card');
    if (card) openPassModal(card.getAttribute('data-id'));
  });

  /* --- 新增訪客登記 Modal --- */
  function openFormModal() {
    visitorForm.reset();
    document.getElementById('visitorUnit').value = CURRENT_UNIT;
    document.getElementById('visitorTime').min = toDateTimeLocal(new Date());
    formModalOverlay.classList.add('is-active');
  }

  function closeFormModal() {
    formModalOverlay.classList.remove('is-active');
  }

  if (btnAddVisitor) btnAddVisitor.addEventListener('click', openFormModal);
  if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
  formModalOverlay.addEventListener('click', function (e) {
    if (e.target === formModalOverlay) closeFormModal();
  });

  visitorForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('visitorName').value.trim();
    var phone = document.getElementById('visitorPhone').value.trim();
    var car = document.getElementById('visitorCar').value.trim();
    var visitTime = document.getElementById('visitorTime').value;
    var note = document.getElementById('visitorNote').value.trim();

    var phonePattern = /^09\d{8}$/;
    if (!phonePattern.test(phone)) {
      alert('請輸入正確的手機號碼格式（例如：0912345678）');
      return;
    }
    if (!visitTime) {
      alert('請選擇預計來訪時間');
      return;
    }

    var newPass = {
      id: 'V' + Date.now(),
      name: name,
      phone: phone,
      unit: CURRENT_UNIT,
      car: car,
      visitTime: visitTime,
      note: note,
      status: 'pending',
      password: generatePassword(),
      arrivedTime: null
    };

    passes.push(newPass);
    savePasses(passes);
    renderList();
    closeFormModal();
    openPassModal(newPass.id);
  });

  /* --- 訪客通行證詳情 Modal --- */
  function openPassModal(id) {
    var p = passes.filter(function (item) { return item.id === id; })[0];
    if (!p) return;
    activePassId = id;

    passName.textContent = p.name;
    passStatus.className = 'pass-status status-' + p.status;
    passStatus.innerHTML = '<span>' + STATUS_TEXT[p.status] + '</span>';

    var rows = [
      ['聯絡電話', p.phone],
      ['拜訪戶別', p.unit],
      ['車　　號', p.car || '未提供'],
      ['來訪時間', formatDateTime(p.visitTime)]
    ];
    if (p.note) rows.push(['備註', p.note]);
    if (p.status === 'arrived' && p.arrivedTime) {
      rows.push(['實際到訪', formatDateTime(p.arrivedTime)]);
    }

    passInfoList.innerHTML = rows.map(function (row) {
      return '<div class="pass-info-row"><span class="pass-info-label">' + row[0] +
        '</span><span class="pass-info-value">' + escapeHtml(row[1]) + '</span></div>';
    }).join('');

    // QR Code + 通行密碼：僅待到訪狀態顯示
    if (p.status === 'pending') {
      passQrSection.style.display = '';
      passCode.textContent = p.password;
      passQrVisual.innerHTML = renderQrCells(p.id + p.password);
    } else {
      passQrSection.style.display = 'none';
    }

    // 額外提示區塊（已到訪 / 已取消）
    var extraNote = document.getElementById('passExtraNote');
    if (extraNote) extraNote.remove();
    if (p.status === 'arrived') {
      var arrivedNote = document.createElement('p');
      arrivedNote.id = 'passExtraNote';
      arrivedNote.className = 'pass-arrived-note';
      arrivedNote.textContent = '✅ 訪客已於 ' + formatDateTime(p.arrivedTime) + ' 完成到訪通知。';
      passActions.parentNode.insertBefore(arrivedNote, passActions);
    } else if (p.status === 'cancelled') {
      var cancelledNote = document.createElement('p');
      cancelledNote.id = 'passExtraNote';
      cancelledNote.className = 'pass-cancelled-note';
      cancelledNote.textContent = '此筆訪客登記已取消，通行證已失效。';
      passActions.parentNode.insertBefore(cancelledNote, passActions);
    }

    // 操作按鈕：僅待到訪狀態顯示「取消登記」與「模擬抵達」
    passActions.style.display = p.status === 'pending' ? '' : 'none';

    passModalOverlay.classList.add('is-active');
  }

  function closePassModal() {
    passModalOverlay.classList.remove('is-active');
    activePassId = null;
  }

  if (passModalClose) passModalClose.addEventListener('click', closePassModal);
  passModalOverlay.addEventListener('click', function (e) {
    if (e.target === passModalOverlay) closePassModal();
  });

  /* --- 分享通行證資訊 --- */
  if (btnPassShare) {
    btnPassShare.addEventListener('click', function () {
      var p = passes.filter(function (item) { return item.id === activePassId; })[0];
      if (!p) return;
      var shareText = '【訪客通行證】' + p.name + '\n拜訪戶別：' + p.unit +
        '\n來訪時間：' + formatDateTime(p.visitTime) + '\n通行密碼：' + p.password;

      if (navigator.share) {
        navigator.share({ title: '訪客通行證', text: shareText }).catch(function () { /* 使用者取消分享 */ });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(function () {
          showToast('已複製', '通行資訊已複製，請傳送給訪客。');
        }).catch(function () {
          alert(shareText);
        });
      } else {
        alert(shareText);
      }
    });
  }

  /* --- 取消登記 --- */
  if (btnPassCancel) {
    btnPassCancel.addEventListener('click', function () {
      if (!activePassId) return;
      if (!confirm('確定要取消此筆訪客登記嗎？取消後通行證將立即失效。')) return;

      passes = passes.map(function (p) {
        if (p.id === activePassId) p.status = 'cancelled';
        return p;
      });
      savePasses(passes);
      renderList();
      closePassModal();
    });
  }

  /* --- 模擬訪客抵達（Demo：展示即時通知效果） --- */
  if (btnPassDemoArrive) {
    btnPassDemoArrive.addEventListener('click', function () {
      if (!activePassId) return;
      var target = null;
      passes = passes.map(function (p) {
        if (p.id === activePassId) {
          p.status = 'arrived';
          p.arrivedTime = toDateTimeLocal(new Date());
          target = p;
        }
        return p;
      });
      savePasses(passes);
      renderList();
      closePassModal();

      if (target) {
        showToast('訪客已抵達', target.name + '已抵達社區，正在前往 ' + target.unit + '，系統已即時通知您。');
      }
    });
  }

  /* --- 即時通知 Toast --- */
  function showToast(title, desc) {
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toast.classList.add('is-active');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-active');
    }, 4000);
  }

  /* --- 通行密碼產生（6 碼數字） --- */
  function generatePassword() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /* --- 產生示意用 QR Code 圖樣（依訪客編號＋密碼決定性產生，非隨機、非真實可掃描 QR） --- */
  function renderQrCells(seed) {
    var size = 11;
    var hash = 0;
    for (var i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    var finderCells = {};
    markFinderPattern(finderCells, 0, 0, size);
    markFinderPattern(finderCells, 0, size - 3, size);
    markFinderPattern(finderCells, size - 3, 0, size);

    var cellsHtml = '';
    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        var key = r + '-' + c;
        var isDark;
        if (finderCells.hasOwnProperty(key)) {
          isDark = finderCells[key];
        } else {
          hash = (hash * 1103515245 + 12345) >>> 0;
          isDark = ((hash >> 16) & 1) === 1;
        }
        cellsHtml += '<span class="qr-cell' + (isDark ? '' : ' qr-empty') + '"></span>';
      }
    }
    return cellsHtml;
  }

  // 在指定角落標記 3x3 定位標記外框樣式（模擬真實 QR Code 角落定位圖案）
  function markFinderPattern(map, rowStart, colStart, size) {
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        var isBorder = (r === 0 || r === 2 || c === 0 || c === 2);
        map[(rowStart + r) + '-' + (colStart + c)] = isBorder;
      }
    }
  }

  /* --- 時間格式化：datetime-local 字串 → YYYY/MM/DD HH:mm --- */
  function formatDateTime(value) {
    if (!value) return '';
    var d = new Date(value);
    if (isNaN(d.getTime())) return value;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function toDateTimeLocal(d) {
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderList();

});
