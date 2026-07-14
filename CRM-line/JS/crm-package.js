/* ============================================
   我的包裹頁面互動邏輯
   包裹狀態與照片僅由管理室維護，本頁對住戶僅提供
   瀏覽與「出示收件條碼」功能，不提供自行變更狀態的操作。
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var filterTabs = document.querySelectorAll('#packageFilterTabs .filter-tab');
  var packageList = document.getElementById('packageList');
  var emptyState = document.getElementById('packageEmptyState');

  var modalOverlay = document.getElementById('packageModalOverlay');
  var modalClose = document.getElementById('packageModalClose');
  var modalNumber = document.getElementById('modalPackageNumber');
  var modalStatus = document.getElementById('modalPackageStatus');
  var modalInfoList = document.getElementById('modalInfoList');

  var modalPhotoGrid = document.getElementById('modalPhotoGrid');
  var barcodeSection = document.getElementById('barcodeSection');
  var barcodeVisual = document.getElementById('barcodeVisual');
  var barcodeCode = document.getElementById('barcodeCode');

  var lightboxOverlay = document.getElementById('photoLightboxOverlay');
  var lightboxImg = document.getElementById('photoLightboxImg');
  var lightboxClose = document.getElementById('photoLightboxClose');

  // 僅「待領取」與「催收中」的包裹尚待領取，需顯示收件條碼
  var PENDING_STATUSES = ['pending', 'urging'];
  var STATUS_TEXT = { pending: '待領取', urging: '催收中', picked: '已領取' };

  /* --- 篩選標籤切換 --- */
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      applyFilter(tab.getAttribute('data-filter'));
    });
  });

  function applyFilter(filterType) {
    var cards = packageList.querySelectorAll('.package-card');
    var visibleCount = 0;
    cards.forEach(function (card) {
      var show = (filterType === 'all') || (card.getAttribute('data-status') === filterType);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    emptyState.style.display = visibleCount === 0 ? '' : 'none';
    packageList.style.display = visibleCount === 0 ? 'none' : '';
  }

  /* --- 包裹卡片點擊：開啟詳情 Modal --- */
  packageList.addEventListener('click', function (e) {
    var card = e.target.closest('.package-card');
    if (card) openModal(card);
  });

  function openModal(card) {
    var status = card.getAttribute('data-status');

    modalNumber.textContent = card.getAttribute('data-number');
    modalStatus.className = 'modal-package-status status-' + status;
    modalStatus.innerHTML = '<span>' + STATUS_TEXT[status] + '</span>';

    var rows = [
      ['收件人', card.getAttribute('data-recipient') + '（' + card.getAttribute('data-unit') + '）'],
      ['物流業者', card.getAttribute('data-courier')],
      ['到件時間', card.getAttribute('data-arrival')],
      ['存放地點', card.getAttribute('data-location')]
    ];

    if (status === 'picked') {
      rows.push(['領取時間', card.getAttribute('data-pickup-time')]);
      rows.push(['領取人', card.getAttribute('data-pickup-name')]);
    }
    if (card.getAttribute('data-note')) {
      var noteLabel = status === 'urging' ? '催收說明' : '備註';
      rows.push([noteLabel, card.getAttribute('data-note')]);
    }

    modalInfoList.innerHTML = rows.map(function (row) {
      return '<div class="modal-info-row"><span class="modal-info-label">' + row[0] +
        '</span><span class="modal-info-value">' + row[1] + '</span></div>';
    }).join('');

    renderPhotos(card.getAttribute('data-photos'));

    // 僅待領取／催收中的包裹顯示住戶收件條碼，供管理室掃描完成領取
    if (PENDING_STATUSES.indexOf(status) !== -1) {
      barcodeSection.style.display = '';
      var code = card.getAttribute('data-number');
      barcodeCode.textContent = code;
      barcodeVisual.innerHTML = renderBarcodeBars(code);
    } else {
      barcodeSection.style.display = 'none';
    }

    modalOverlay.classList.add('is-active');
  }

  function closeModal() {
    modalOverlay.classList.remove('is-active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  /* --- 包裹照片（管理室維護，住戶僅可檢視） --- */
  function renderPhotos(photosAttr) {
    var urls = (photosAttr || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    if (urls.length === 0) {
      modalPhotoGrid.innerHTML = '<div class="modal-photo-empty">管理室尚未上傳包裹照片</div>';
      return;
    }

    modalPhotoGrid.innerHTML = urls.map(function (url) {
      return '<button type="button" class="modal-photo-thumb" data-photo-url="' + url + '">' +
        '<img src="' + url + '" alt="包裹照片" loading="lazy"></button>';
    }).join('');
  }

  modalPhotoGrid.addEventListener('click', function (e) {
    var thumb = e.target.closest('.modal-photo-thumb');
    if (!thumb) return;
    lightboxImg.src = thumb.getAttribute('data-photo-url');
    lightboxOverlay.classList.add('is-active');
  });

  function closeLightbox() {
    lightboxOverlay.classList.remove('is-active');
    lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  /* --- 產生住戶收件條碼視覺樣式（依包裹編號決定性產生，非隨機） --- */
  function renderBarcodeBars(code) {
    var bars = '';
    for (var i = 0; i < code.length; i++) {
      var charCode = code.charCodeAt(i);
      var width = (charCode % 3) + 1;
      var gap = (charCode % 2) + 1;
      bars += '<span class="bar" style="width:' + width + 'px;margin-right:' + gap + 'px;"></span>';
    }
    return bars;
  }

});
