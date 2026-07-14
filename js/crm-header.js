/* ============================================
   共用頂部導覽列元件
   依據 crm-guarantee-service.html header 規格
   用法：在 HTML 中放置 <div id="crmHeader" data-title="頁面標題"></div>
   ============================================ */

(function () {
  'use strict';

  /**
   * 初始化共用頂部導覽列
   * 讀取 #crmHeader 的 data-title 屬性作為頁面標題
   */
  function initCrmHeader() {
    var headerEl = document.getElementById('crmHeader');
    if (!headerEl) return;

    // 取得頁面標題（來自 data-title 屬性）
    var pageTitle = headerEl.getAttribute('data-title') || '';
    // 取得返回目標頁面（來自 data-back 屬性，預設為首頁）
    var backUrl = headerEl.getAttribute('data-back') || 'crm-index.html';
    // 取得首頁按鈕目標頁面（來自 data-home 屬性，預設維持原本的建案版首頁）
    var homeUrl = headerEl.getAttribute('data-home') || 'crm-index.html';

    // 產生共用 header HTML
    headerEl.className = 'top-bar';
    headerEl.innerHTML =
      '<!-- 返回按鈕 -->' +
      '<button class="btn-back" id="btnBack" aria-label="返回">' +
        '<img src="assets/arrow.svg" alt="">' +
        '<img class="arrow-icon" src="assets/arrow-icon.svg" alt="">' +
      '</button>' +
      '<!-- 頁面標題 -->' +
      '<h1 class="page-title">' + pageTitle + '</h1>' +
      '<!-- 首頁按鈕 -->' +
      '<a class="btn-home" id="btnHome" href="' + homeUrl + '" aria-label="首頁">' +
        '<img class="home-icon" src="assets/home-icon.svg" alt="">' +
        '<span>首頁</span>' +
      '</a>';

    // 綁定返回按鈕事件（使用 data-back 指定的明確路徑）
    var btnBack = document.getElementById('btnBack');
    if (btnBack) {
      btnBack.addEventListener('click', function () {
        window.location.href = backUrl;
      });
    }
  }

  // DOM 載入後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrmHeader);
  } else {
    initCrmHeader();
  }
})();
