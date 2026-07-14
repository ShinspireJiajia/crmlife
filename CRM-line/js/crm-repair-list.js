/* ============================================
   報修表單進度 — 完整清單頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var repairOrderList = document.getElementById('repairOrderList');
  var emptyState = document.getElementById('repairEmptyState');
  var categoryTabs = document.querySelectorAll('#repairFilterTabs .filter-tab');
  var statusTabs = document.querySelectorAll('#repairStatusTabs .filter-tab');
  var searchInput = document.getElementById('searchInput');
  var activeSearchChip = document.getElementById('activeSearchChip');
  var activeSearchChipText = document.getElementById('activeSearchChipText');
  var btnClearSearch = document.getElementById('btnClearSearch');

  var currentCategory = 'all';
  var currentStatus = 'all';
  var currentKeyword = '';

  // --- 分類篩選標籤（綠海維修 / 個案單報修） ---
  categoryTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      categoryTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-filter');
      applyFilter();
    });
  });

  // --- 狀態篩選標籤（處理中 / 已完成） ---
  statusTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      statusTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentStatus = tab.getAttribute('data-status-filter');
      applyFilter();
    });
  });

  // --- 關鍵字搜尋：查詢問題描述（按 Enter 提交後才套用） ---
  function submitSearch() {
    currentKeyword = searchInput.value.trim().toLowerCase();
    updateSearchChip();
    applyFilter();
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch();
      }
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', function () {
      currentKeyword = '';
      if (searchInput) searchInput.value = '';
      updateSearchChip();
      applyFilter();
    });
  }

  function updateSearchChip() {
    if (!activeSearchChip) return;
    if (currentKeyword) {
      activeSearchChip.hidden = false;
      if (activeSearchChipText) activeSearchChipText.textContent = '搜尋：' + currentKeyword;
    } else {
      activeSearchChip.hidden = true;
    }
  }

  function applyFilter() {
    var cards = repairOrderList.querySelectorAll('.repair-order-card');
    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchCategory = (currentCategory === 'all') || (card.getAttribute('data-category') === currentCategory);
      var matchStatus = (currentStatus === 'all') || (card.getAttribute('data-status') === currentStatus);
      var matchKeyword = true;

      if (currentKeyword) {
        var description = (card.getAttribute('data-description') || '').toLowerCase();
        matchKeyword = description.indexOf(currentKeyword) !== -1;
      }

      var show = matchCategory && matchStatus && matchKeyword;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (emptyState) emptyState.style.display = visibleCount === 0 ? '' : 'none';
    repairOrderList.style.display = visibleCount === 0 ? 'none' : '';
  }

  // --- 報修卡片「內容查看」按鈕 ---
  var viewButtons = document.querySelectorAll('.btn-view-order');
  viewButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.repair-order-card');
      var orderNum = card ? card.querySelector('.order-number') : null;
      var statusEl = card ? card.querySelector('.order-status span') : null;
      var status = statusEl ? statusEl.textContent.trim() : '';
      var num = orderNum ? orderNum.textContent.trim() : '';
      // 根據狀態導向報修內容查看頁
      window.location.href = 'crm-repair-detail.html?order=' + encodeURIComponent(num) + '&status=' + encodeURIComponent(status);
    });
  });

});
