/* ============================================
   全站 Loading 遮罩控制腳本
   頁面完成載入後自動隱藏 Loading 畫面
   ============================================ */

(function () {
  'use strict';

  /**
   * 隱藏 Loading 遮罩
   * 加上 is-hidden class 觸發淡出動畫，動畫結束後移除 DOM
   */
  function hideLoader() {
    var loader = document.getElementById('crmPageLoader');
    if (!loader) return;

    loader.classList.add('is-hidden');
  }

  // 頁面完全載入後（含圖片、字型等外部資源）隱藏 Loading
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  // 安全上限：無論如何 5 秒後強制隱藏，避免永久卡住
  setTimeout(hideLoader, 5000);

})();
