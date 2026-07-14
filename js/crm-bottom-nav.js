/* ============================================
   共用常駐底部選單元件
   用法：在 HTML 中放置 <div id="crmBottomNav"></div>
   ============================================ */

(function () {
  'use strict';

  // 四個常駐功能頁籤
  var NAV_ITEMS = [
    { key: 'forest', label: '周邊資訊', href: 'crm-nearby-list.html', icon: 'assets/icon-forest.png' },
    { key: 'life', label: '生活服務', href: 'crm-life-service-list.html', icon: 'assets/icon-house-checkup.svg' },
    { key: 'notify', label: '訊息中心', href: 'crm-notification.html', icon: 'assets/icon-bell.svg' },
    { key: 'more', label: '更多功能', href: 'crm-all-features.html', icon: 'assets/icon-grid-more.svg' }
  ];

  // 頁面檔名 -> 對應頁籤 key（用於判斷目前所在頁籤並標示 active）
  var PAGE_ACTIVE_MAP = {
    'crm-nearby-list.html': 'forest',
    'crm-life-service-list.html': 'life',
    'crm-life-service-booking-detail.html': 'life',
    'crm-notification.html': 'notify',
    'crm-all-features.html': 'more'
  };

  function getCurrentPage() {
    var path = location.pathname;
    var page = path.substring(path.lastIndexOf('/') + 1);
    return page || '';
  }

  function initBottomNav() {
    var container = document.getElementById('crmBottomNav');
    if (!container) return;

    var activeKey = PAGE_ACTIVE_MAP[getCurrentPage()] || '';

    container.className = 'crm-bottom-nav';
    container.innerHTML = NAV_ITEMS.map(function (item) {
      var activeClass = item.key === activeKey ? ' active' : '';
      return '<a class="bottom-nav-item' + activeClass + '" href="' + item.href + '">' +
        '<img class="nav-icon" src="' + item.icon + '" alt="" loading="lazy">' +
        '<span class="nav-label">' + item.label + '</span>' +
      '</a>';
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBottomNav);
  } else {
    initBottomNav();
  }
})();
