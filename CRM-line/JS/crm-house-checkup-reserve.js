/* ============================================
   預約房屋健診服務表單互動邏輯
   根據 Figma 設計稿 (node-id: 248:2027)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-house-checkup.html';
      }
    });
  }

  // --- 離開按鈕 ---
  var btnLeave = document.getElementById('btnLeave');
  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      window.location.href = 'crm-house-checkup.html';
    });
  }

  // --- 確認建立按鈕 ---
  var btnConfirm = document.getElementById('btnConfirm');
  var checkupForm = document.getElementById('checkupForm');
  if (btnConfirm && checkupForm) {
    btnConfirm.addEventListener('click', function () {
      // 取得各欄位值
      var project = document.getElementById('project');
      var unit = document.getElementById('unit');
      var date = document.getElementById('date');
      var timeSlot = document.getElementById('timeSlot');
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');

      // 驗證必填欄位
      var errors = [];
      if (!project.value) errors.push('請選擇建案');
      if (!unit.value) errors.push('請選擇戶別');
      if (!date.value) errors.push('請選擇日期');
      if (!timeSlot.value) errors.push('請選擇時段');
      if (!name.value.trim()) errors.push('請輸入姓名');
      if (!phone.value.trim()) errors.push('請輸入手機');

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // 手機格式驗證（台灣手機號碼）
      var phonePattern = /^09\d{8}$/;
      if (!phonePattern.test(phone.value.trim())) {
        alert('請輸入正確的手機號碼格式（例如：0912345678）');
        return;
      }

      // 模擬送出成功
      alert('預約建立成功！');
      window.location.href = 'crm-house-checkup.html';
    });
  }

});
