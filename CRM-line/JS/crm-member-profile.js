/* ============================================
   會員資料頁面互動邏輯
   根據 Figma 設計稿 (node-id: 288:274 / 288:183)
   - 檢視模式 (288:274)：欄位唯讀，顯示「修改」按鈕
   - 編輯模式 (288:183)：欄位可編輯，顯示「離開」+「確認變更」
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素參考 ---
  var pageContainer = document.querySelector('.crm-member-profile');
  var profileForm = document.getElementById('profileForm');
  var viewModeButtons = document.getElementById('viewModeButtons');
  var editModeButtons = document.getElementById('editModeButtons');
  var btnEdit = document.getElementById('btnEdit');
  var btnCancel = document.getElementById('btnCancel');
  var btnConfirm = document.getElementById('btnConfirm');
  var btnBack = document.getElementById('btnBack');

  // 所有文字輸入框
  var textInputs = profileForm.querySelectorAll('.form-input');

  // 所有 radio 按鈕
  var radioInputs = profileForm.querySelectorAll('input[type="radio"]');

  // 日期相關
  var birthdayInput = document.getElementById('memberBirthday');
  var birthdayPicker = document.getElementById('memberBirthdayPicker');
  var calendarIcon = document.querySelector('.field-icon');

  // 儲存原始值（用於取消時恢復）
  var originalValues = {};

  // --- 儲存目前欄位值 ---
  function saveOriginalValues() {
    originalValues = {};
    textInputs.forEach(function (input) {
      originalValues[input.id] = input.value;
    });
    radioInputs.forEach(function (radio) {
      if (radio.checked) {
        originalValues['gender'] = radio.value;
      }
    });
  }

  // --- 恢復原始值 ---
  function restoreOriginalValues() {
    textInputs.forEach(function (input) {
      if (originalValues[input.id] !== undefined) {
        input.value = originalValues[input.id];
      }
    });
    radioInputs.forEach(function (radio) {
      radio.checked = (radio.value === originalValues['gender']);
    });
  }

  // --- 切換至編輯模式 ---
  function enterEditMode() {
    saveOriginalValues();
    pageContainer.classList.add('edit-mode');

    // 解除文字輸入框唯讀
    textInputs.forEach(function (input) {
      input.removeAttribute('readonly');
    });

    // 解除 radio 停用
    radioInputs.forEach(function (radio) {
      radio.removeAttribute('disabled');
    });

    // 切換按鈕區域
    viewModeButtons.classList.add('hidden');
    editModeButtons.classList.remove('hidden');
  }

  // --- 切換至檢視模式 ---
  function enterViewMode() {
    pageContainer.classList.remove('edit-mode');

    // 設定文字輸入框唯讀
    textInputs.forEach(function (input) {
      input.setAttribute('readonly', '');
    });

    // 停用 radio
    radioInputs.forEach(function (radio) {
      radio.setAttribute('disabled', '');
    });

    // 切換按鈕區域
    editModeButtons.classList.add('hidden');
    viewModeButtons.classList.remove('hidden');
  }

  // --- 事件繫結 ---

  // 點擊「修改」→ 進入編輯模式
  if (btnEdit) {
    btnEdit.addEventListener('click', function () {
      enterEditMode();
    });
  }

  // 點擊「離開」→ 恢復原始值並回到檢視模式
  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      restoreOriginalValues();
      enterViewMode();
    });
  }

  // 點擊「確認變更」→ 儲存並回到檢視模式
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      // 此處可加入 API 呼叫，將修改後的資料送至後端
      console.log('會員資料已更新');
      enterViewMode();
    });
  }

  // 返回按鈕
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  // 日期選擇器：點擊日曆圖示時觸發
  if (calendarIcon && birthdayPicker) {
    calendarIcon.addEventListener('click', function () {
      if (pageContainer.classList.contains('edit-mode')) {
        birthdayPicker.showPicker ? birthdayPicker.showPicker() : birthdayPicker.click();
      }
    });
  }

  // 日期選擇器：選擇後同步顯示值
  if (birthdayPicker && birthdayInput) {
    birthdayPicker.addEventListener('change', function () {
      if (birthdayPicker.value) {
        // 格式化為 年/月/日
        var parts = birthdayPicker.value.split('-');
        birthdayInput.value = parts[0] + '/' + parts[1] + '/' + parts[2];
      }
    });
  }

});
