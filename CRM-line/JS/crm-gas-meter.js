/* ============================================
   超瓦斯表頁面 — 手動新增抄表紀錄邏輯
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'crmGasMeterManualRecords';

  // 已登入會員帳號（對應會員資料頁「會員姓名」欄位，實際串接後台後改為讀取登入 session）
  var CURRENT_USER_NAME = 'liu jiayun';

  /* ------------------------------------------
     DOM 元素參照
     ------------------------------------------ */
  var btnAddManual = document.getElementById('btnAddManual');
  var meterRecordList = document.getElementById('meterRecordList');
  var meterSummaryValue = document.getElementById('meterSummaryValue');
  var meterSummaryDate = document.getElementById('meterSummaryDate');
  var meterSummaryUpdater = document.getElementById('meterSummaryUpdater');
  var meterSummaryUpdaterName = document.getElementById('meterSummaryUpdaterName');

  var gasModalOverlay = document.getElementById('gasModalOverlay');
  var gasModalClose = document.getElementById('gasModalClose');
  var gasAddForm = document.getElementById('gasAddForm');
  var gasInputDate = document.getElementById('gasInputDate');
  var gasInputUsage = document.getElementById('gasInputUsage');
  var gasInputName = document.getElementById('gasInputName');

  /* ------------------------------------------
     讀取 / 儲存 手動新增紀錄
     ------------------------------------------ */
  function loadManualRecords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveManualRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  /* ------------------------------------------
     渲染手動新增的抄表紀錄（附留存人員資訊）
     ------------------------------------------ */
  function renderManualRecords() {
    if (!meterRecordList) return;

    var records = loadManualRecords();

    // 移除先前渲染過的手動紀錄，避免重複
    var existing = meterRecordList.querySelectorAll('.meter-record-item.is-manual');
    existing.forEach(function (el) { el.remove(); });

    // 依日期新到舊排序，整批插入清單最前方（維持新到舊順序）
    var originalFirstChild = meterRecordList.firstChild;
    var fragment = document.createDocumentFragment();

    records
      .slice()
      .sort(function (a, b) { return b.date.localeCompare(a.date); })
      .forEach(function (record) {
        var item = document.createElement('div');
        item.className = 'meter-record-item is-manual';

        var main = document.createElement('div');
        main.className = 'meter-record-main';

        var dateSpan = document.createElement('span');
        dateSpan.className = 'meter-record-date';
        dateSpan.textContent = record.date;

        var usageSpan = document.createElement('span');
        usageSpan.className = 'meter-record-usage';
        usageSpan.textContent = record.usage + ' 度';

        main.appendChild(dateSpan);
        main.appendChild(usageSpan);

        var meta = document.createElement('div');
        meta.className = 'meter-record-meta';

        var badge = document.createElement('span');
        badge.className = 'meter-record-badge';
        badge.textContent = '手動新增';

        var nameText = document.createElement('span');
        nameText.textContent = '留存人員｜' + record.name;

        meta.appendChild(badge);
        meta.appendChild(nameText);

        item.appendChild(main);
        item.appendChild(meta);

        fragment.appendChild(item);
      });

    meterRecordList.insertBefore(fragment, originalFirstChild);

    updateSummary(records);
  }

  /* ------------------------------------------
     更新本期用量摘要（取最新一筆手動紀錄）
     ------------------------------------------ */
  function updateSummary(records) {
    if (!records.length) return;

    var latest = records.slice().sort(function (a, b) { return b.date.localeCompare(a.date); })[0];

    if (meterSummaryValue) {
      meterSummaryValue.innerHTML = latest.usage + '<span>度</span>';
    }
    if (meterSummaryDate) {
      meterSummaryDate.textContent = '上次抄表日期｜' + latest.date;
    }
    if (meterSummaryUpdater && meterSummaryUpdaterName) {
      meterSummaryUpdaterName.textContent = latest.name;
      meterSummaryUpdater.hidden = false;
    }
  }

  /* ------------------------------------------
     Modal 開關
     ------------------------------------------ */
  function openGasModal() {
    if (!gasModalOverlay) return;
    gasAddForm.reset();
    gasInputDate.value = new Date().toISOString().slice(0, 10);
    gasInputName.value = CURRENT_USER_NAME;
    gasModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeGasModal() {
    if (!gasModalOverlay) return;
    gasModalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (btnAddManual) {
    btnAddManual.addEventListener('click', openGasModal);
  }

  if (gasModalClose) {
    gasModalClose.addEventListener('click', closeGasModal);
  }

  if (gasModalOverlay) {
    gasModalOverlay.addEventListener('click', function (e) {
      if (e.target === gasModalOverlay) closeGasModal();
    });
  }

  /* ------------------------------------------
     表單送出：新增一筆手動抄表紀錄
     ------------------------------------------ */
  if (gasAddForm) {
    gasAddForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var date = gasInputDate.value;
      var usage = parseFloat(gasInputUsage.value);
      var name = gasInputName.value.trim();

      if (!date || isNaN(usage) || !name) return;

      var confirmed = confirm(
        '確定要新增這筆抄表紀錄嗎？\n' +
        '抄表日期：' + date + '\n' +
        '用量：' + usage + ' 度\n' +
        '留存人員：' + name
      );
      if (!confirmed) return;

      var records = loadManualRecords();
      records.push({ date: date, usage: usage, name: name });
      saveManualRecords(records);

      renderManualRecords();
      closeGasModal();
      alert('已新增抄表紀錄，留存人員：' + name);
    });
  }

  /* ------------------------------------------
     啟動初始化
     ------------------------------------------ */
  renderManualRecords();

})();
