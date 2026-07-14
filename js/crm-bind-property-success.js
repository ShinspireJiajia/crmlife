/* ============================================
   物業人員註冊成功頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      // 返回綁定身份頁
      window.location.href = 'crm-bind-identity.html';
    });
  }

  // --- 確認按鈕：返回綁定身份頁 ---
  var btnConfirm = document.getElementById('btnConfirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      window.location.href = 'crm-bind-identity.html';
    });
  }

});
