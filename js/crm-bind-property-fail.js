/* ============================================
   物業人員註冊失敗頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      // 返回表單頁重新填寫
      window.location.href = 'crm-bind-property.html';
    });
  }

  // --- 確認按鈕：回到表單頁重新填寫 ---
  var btnConfirm = document.getElementById('btnConfirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      window.location.href = 'crm-bind-property.html';
    });
  }

});
