/* ============================================
   社區公告 — 清單頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  var listEl = document.getElementById('announcementList');
  var emptyState = document.getElementById('announcementEmptyState');
  var tabs = document.querySelectorAll('#announcementFilterTabs .filter-tab');
  var currentFilter = 'all';

  if (!listEl || !window.CrmAnnouncement) return;

  function createCard(item) {
    var unread = !CrmAnnouncement.isRead(item.id);
    var categoryLabel = CrmAnnouncement.categoryLabels[item.category] || '';

    var card = document.createElement('div');
    card.className = 'announcement-card' + (unread ? ' is-unread' : '');
    card.setAttribute('data-category', item.category);

    var tagsHtml =
      (item.pinned ? '<span class="tag-pinned">置頂</span>' : '') +
      '<span class="tag-category tag-' + item.category + '">' + categoryLabel + '</span>';

    card.innerHTML =
      '<div class="announcement-card-header">' +
        '<div class="announcement-tags">' + tagsHtml + '</div>' +
        (unread ? '<span class="unread-dot" aria-label="未讀"></span>' : '') +
      '</div>' +
      '<p class="announcement-title">' + item.title + '</p>' +
      '<p class="announcement-summary">' + item.summary + '</p>' +
      '<p class="announcement-date">' + item.date + '</p>';

    card.addEventListener('click', function () {
      window.location.href = 'crm-announcement-detail.html?id=' + encodeURIComponent(item.id);
    });

    return card;
  }

  function render() {
    listEl.innerHTML = '';

    // 置頂公告優先顯示，其餘依資料原有順序（日期新到舊）排列
    var sorted = CrmAnnouncement.data.slice().sort(function (a, b) {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });

    var visibleCount = 0;
    sorted.forEach(function (item) {
      var match = currentFilter === 'all' || item.category === currentFilter;
      if (!match) return;
      listEl.appendChild(createCard(item));
      visibleCount++;
    });

    if (emptyState) emptyState.style.display = visibleCount === 0 ? '' : 'none';
    listEl.style.display = visibleCount === 0 ? 'none' : '';
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      render();
    });
  });

  render();
});
