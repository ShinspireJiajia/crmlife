/* ============================================
   社區公告 — 詳情頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  if (!window.CrmAnnouncement) return;

  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');
  var item = id ? CrmAnnouncement.getById(id) : null;

  // 找不到對應公告時導回清單頁
  if (!item) {
    window.location.href = 'crm-announcement-list.html';
    return;
  }

  CrmAnnouncement.markRead(item.id);

  var titleEl = document.getElementById('annTitle');
  var dateEl = document.getElementById('annDate');
  var categoryEl = document.getElementById('annCategory');
  var pinnedEl = document.getElementById('annPinned');
  var contentEl = document.getElementById('annContent');

  if (titleEl) titleEl.textContent = item.title;
  if (dateEl) dateEl.textContent = item.date;

  if (categoryEl) {
    categoryEl.textContent = CrmAnnouncement.categoryLabels[item.category] || '';
    categoryEl.className = 'tag-category tag-' + item.category;
  }

  if (pinnedEl) pinnedEl.style.display = item.pinned ? '' : 'none';

  if (contentEl) {
    contentEl.innerHTML = '';
    item.content.forEach(function (paragraph) {
      var p = document.createElement('p');
      p.textContent = paragraph;
      contentEl.appendChild(p);
    });
  }
});
