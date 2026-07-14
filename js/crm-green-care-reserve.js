/* ============================================
   預約綠海養護表單互動邏輯
   根據 Figma 設計稿 (node-id: 1:3339)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnLeave = document.getElementById('btnLeave');
  var btnConfirm = document.getElementById('btnConfirm');
  var reserveForm = document.getElementById('reserveForm');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care.html';
      }
    });
  }

  // --- 離開按鈕 ---
  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care.html';
      }
    });
  }

  // --- 表單驗證 ---
  function validateForm() {
    var isValid = true;
    var requiredFields = [
      { id: 'project', type: 'select' },
      { id: 'unit', type: 'select' },
      { id: 'reserveDate', type: 'date' },
      { id: 'timeSlot', type: 'select' }
    ];

    // 清除舊的錯誤狀態
    var errorGroups = document.querySelectorAll('.form-group.has-error');
    errorGroups.forEach(function (g) { g.classList.remove('has-error'); });
    var errorMsgs = document.querySelectorAll('.form-error-msg');
    errorMsgs.forEach(function (m) { m.remove(); });

    requiredFields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el) return;
      var value = el.value.trim();

      if (!value) {
        isValid = false;
        var group = el.closest('.form-group');
        if (group) {
          group.classList.add('has-error');
          var errorMsg = document.createElement('p');
          errorMsg.className = 'form-error-msg';
          errorMsg.textContent = '此欄位為必填';
          group.appendChild(errorMsg);
        }
      }
    });

    return isValid;
  }

  // --- 確認建立按鈕 ---
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      // 蒐集表單資料
      var formData = {
        project: document.getElementById('project').value,
        unit: document.getElementById('unit').value,
        reserveDate: document.getElementById('reserveDate').value,
        timeSlot: document.getElementById('timeSlot').value,
        remark: document.getElementById('remark').value
      };

      console.log('預約綠海養護表單資料：', formData);

      // 提交成功後返回
      alert('預約建立成功！');
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care.html';
      }
    });
  }

});
