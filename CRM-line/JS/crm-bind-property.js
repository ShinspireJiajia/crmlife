/* ============================================
   物業人員頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:2832)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素取得 ---
  var btnBack = document.getElementById('btnBack');
  var registerForm = document.getElementById('registerForm');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  // --- 表單送出 ---
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // 取得表單欄位值
      var project = document.getElementById('fieldProject').value;
      var passcode = document.getElementById('fieldPasscode').value.trim();
      var name = document.getElementById('fieldName').value.trim();
      var phone = document.getElementById('fieldPhone').value.trim();

      // 基本驗證：所有欄位皆需填寫
      if (!project || !passcode || !name || !phone) {
        window.location.href = 'crm-bind-property-fail.html';
        return;
      }

      // 模擬 API 呼叫：此處以 Mock 邏輯判斷
      // 通行碼為 "1234" 時模擬成功，其餘模擬失敗
      if (passcode === '1234') {
        window.location.href = 'crm-bind-property-success.html';
      } else {
        window.location.href = 'crm-bind-property-fail.html';
      }
    });
  }

});
