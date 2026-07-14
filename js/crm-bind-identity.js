/* ============================================
   綁定身份頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:2798)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  // --- 分頁標籤切換 ---
  var tabItems = document.querySelectorAll('.tab-item');
  var tabRegister = document.getElementById('tabRegister');
  var tabProperty = document.getElementById('tabProperty');

  tabItems.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetTab = tab.getAttribute('data-tab');

      // 物業人員管理：導向獨立頁面
      if (targetTab === 'property') {
        window.location.href = 'crm-bind-property.html';
        return;
      }

      // 移除所有標籤的啟用狀態
      tabItems.forEach(function (t) {
        t.classList.remove('active');
      });
      // 啟用當前標籤
      tab.classList.add('active');

      // 切換顯示內容
      if (targetTab === 'register') {
        tabRegister.classList.remove('hidden');
        tabProperty.classList.add('hidden');
      }
    });
  });

  // --- 選單項目導航 ---

  // 屋主註冊
  var btnOwnerRegister = document.getElementById('btnOwnerRegister');
  if (btnOwnerRegister) {
    btnOwnerRegister.addEventListener('click', function () {
      console.log('前往屋主註冊');
    });
  }

  // 住戶註冊
  var btnResidentRegister = document.getElementById('btnResidentRegister');
  if (btnResidentRegister) {
    btnResidentRegister.addEventListener('click', function () {
      console.log('前往住戶註冊');
    });
  }

  // 物業人員註冊
  var btnPropertyRegister = document.getElementById('btnPropertyRegister');
  if (btnPropertyRegister) {
    btnPropertyRegister.addEventListener('click', function () {
      window.location.href = 'crm-bind-property.html';
    });
  }

});
