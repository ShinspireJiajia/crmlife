/* ============================================
   我要報修表單頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:1908, 1:1954, 1:2128)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 標籤切換邏輯 ---
  var tabCase = document.getElementById('tabCase');
  var tabGreen = document.getElementById('tabGreen');
  var groupPosition = document.getElementById('groupPosition');
  var currentTab = 'case'; // 預設為「個案單報修」

  function switchTab(tab) {
    currentTab = tab;

    // 切換標籤高亮
    if (tab === 'case') {
      tabCase.classList.add('active');
      tabGreen.classList.remove('active');
      // 隱藏維修位置欄位
      if (groupPosition) groupPosition.style.display = 'none';
    } else {
      tabGreen.classList.add('active');
      tabCase.classList.remove('active');
      // 顯示維修位置欄位
      if (groupPosition) groupPosition.style.display = '';
    }
  }

  if (tabCase) {
    tabCase.addEventListener('click', function () {
      switchTab('case');
    });
  }

  if (tabGreen) {
    tabGreen.addEventListener('click', function () {
      switchTab('green');
    });
  }

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index_life.html';
      }
    });
  }

  // --- 建案與戶別連動 ---
  var selectProject = document.getElementById('selectProject');
  var selectUnit = document.getElementById('selectUnit');

  // 模擬戶別資料
  var unitOptions = {
    green: [
      { value: 'a3-3', text: 'A3-3' },
      { value: 'a3-5', text: 'A3-5' },
      { value: 'b2-1', text: 'B2-1' }
    ]
  };

  if (selectProject) {
    selectProject.addEventListener('change', function () {
      var selectedProject = selectProject.value;
      // 清空戶別選項
      selectUnit.innerHTML = '';
      if (selectedProject && unitOptions[selectedProject]) {
        var defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '請選擇戶別';
        selectUnit.appendChild(defaultOpt);
        unitOptions[selectedProject].forEach(function (u) {
          var opt = document.createElement('option');
          opt.value = u.value;
          opt.textContent = u.text;
          selectUnit.appendChild(opt);
        });
      } else {
        var emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.textContent = '請先選擇建案';
        selectUnit.appendChild(emptyOpt);
      }
    });
  }

  // --- 檔案上傳邏輯 ---
  var fileInput = document.getElementById('fileInput');
  var selectedFile = document.getElementById('selectedFile');
  var selectedFileName = document.getElementById('selectedFileName');
  var btnRemoveFile = document.getElementById('btnRemoveFile');

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length > 0) {
        var file = fileInput.files[0];
        // 檢查檔案大小（最大 5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('檔案大小不得超過 5MB');
          fileInput.value = '';
          return;
        }
        if (selectedFileName) selectedFileName.textContent = file.name;
        if (selectedFile) selectedFile.style.display = 'flex';
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', function () {
      if (fileInput) fileInput.value = '';
      if (selectedFile) selectedFile.style.display = 'none';
      if (selectedFileName) selectedFileName.textContent = '';
    });
  }

  // --- 驗證碼畫布產生 ---
  var captchaCanvas = document.getElementById('captchaCanvas');
  var captchaCode = '';

  function generateCaptcha() {
    if (!captchaCanvas) return;
    var ctx = captchaCanvas.getContext('2d');
    var width = captchaCanvas.width;
    var height = captchaCanvas.height;

    // 深色背景
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);

    // 干擾線
    for (var i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 干擾點
    for (var j = 0; j < 30; j++) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }

    // 產生驗證碼文字
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    captchaCode = '';
    ctx.font = 'bold 24px Arial';
    ctx.textBaseline = 'middle';

    for (var k = 0; k < 5; k++) {
      var ch = chars.charAt(Math.floor(Math.random() * chars.length));
      captchaCode += ch;
      ctx.fillStyle = '#ffffff';
      var x = 12 + k * 22;
      var y = height / 2 + (Math.random() * 8 - 4);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
  }

  // 初始產生
  generateCaptcha();

  // 點擊重新產生
  if (captchaCanvas) {
    captchaCanvas.addEventListener('click', function () {
      generateCaptcha();
    });
  }

  // --- 表單提交 ---
  var formView = document.getElementById('formView');
  var confirmView = document.getElementById('confirmView');
  var btnSubmit = document.getElementById('btnSubmit');

  if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {
      // 驗證必填欄位
      var project = selectProject ? selectProject.value : '';
      var unit = selectUnit ? selectUnit.value : '';
      var area = document.getElementById('selectArea');
      var areaVal = area ? area.value : '';
      var desc = document.getElementById('textDescription');
      var descVal = desc ? desc.value.trim() : '';
      var captchaInput = document.getElementById('inputCaptcha');
      var captchaVal = captchaInput ? captchaInput.value.trim().toUpperCase() : '';

      if (!project) {
        alert('請選擇建案');
        return;
      }
      if (!unit) {
        alert('請選擇戶別');
        return;
      }
      if (!areaVal) {
        alert('請選擇維修區域');
        return;
      }
      // 綠海報修額外驗證維修位置
      if (currentTab === 'green') {
        var positionVal = document.getElementById('selectPosition');
        if (positionVal && !positionVal.value) {
          alert('請選擇維修位置');
          return;
        }
      }
      if (!descVal) {
        alert('請輸入問題描述');
        return;
      }
      if (!captchaVal) {
        alert('請輸入驗證碼');
        return;
      }
      if (captchaVal !== captchaCode) {
        alert('驗證碼錯誤，請重新輸入');
        generateCaptcha();
        if (captchaInput) captchaInput.value = '';
        return;
      }

      // 切換到完成確認視圖
      if (formView) formView.style.display = 'none';
      if (confirmView) confirmView.style.display = '';

      // 隱藏標籤列
      var tabBar = document.querySelector('.tab-bar');
      if (tabBar) tabBar.style.display = 'none';
    });
  }

  // --- 離開按鈕 ---
  var btnCancel = document.getElementById('btnCancel');
  if (btnCancel) {
    btnCancel.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index_life.html';
      }
    });
  }

  // --- 確認按鈕（返回首頁） ---
  var btnConfirmHome = document.getElementById('btnConfirmHome');
  if (btnConfirmHome) {
    btnConfirmHome.addEventListener('click', function () {
      window.location.href = 'crm-index_life.html';
    });
  }

  // --- 從 URL 參數讀取預設分頁 ---
  var urlParams = new URLSearchParams(window.location.search);
  var tabParam = urlParams.get('tab');
  if (tabParam === 'green') {
    switchTab('green');
  }

});
