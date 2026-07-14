/* ============================================
   預約驗屋服務頁面互動邏輯
   根據 Figma 設計稿 (node-id: 29:2253)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnLeave = document.getElementById('btnLeave');
  var btnConfirm = document.getElementById('btnConfirm');
  var form = document.getElementById('inspectionForm');
  var thirdPartyRadios = document.querySelectorAll('input[name="thirdParty"]');
  var thirdPartyCompanyGroup = document.getElementById('thirdPartyCompanyGroup');

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      window.history.back();
    });
  }

  // --- 離開按鈕 ---
  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      window.history.back();
    });
  }

  // --- 第三方代驗切換顯示/隱藏驗屋公司欄位 ---
  function toggleThirdPartyCompany() {
    var selected = document.querySelector('input[name="thirdParty"]:checked');
    if (selected && selected.value === 'yes') {
      thirdPartyCompanyGroup.style.display = 'flex';
    } else {
      thirdPartyCompanyGroup.style.display = 'none';
    }
  }

  // 初始化
  toggleThirdPartyCompany();

  // 監聽 radio 變更
  thirdPartyRadios.forEach(function (radio) {
    radio.addEventListener('change', toggleThirdPartyCompany);
  });

  // --- 確認建立按鈕 ---
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      // 取得表單值
      var project = document.getElementById('project');
      var unit = document.getElementById('unit');
      var date = document.getElementById('date');
      var timeSlot = document.getElementById('timeSlot');
      var attendees = document.getElementById('attendees');
      var designers = document.getElementById('designers');
      var thirdParty = document.querySelector('input[name="thirdParty"]:checked');
      var thirdPartyCompany = document.getElementById('thirdPartyCompany');

      // 驗證必填欄位
      if (!project.value) {
        alert('請選擇建案');
        project.focus();
        return;
      }
      if (!unit.value) {
        alert('請選擇戶別');
        unit.focus();
        return;
      }
      if (!date.value) {
        alert('請選擇日期');
        date.focus();
        return;
      }
      if (!timeSlot.value) {
        alert('請選擇時段');
        timeSlot.focus();
        return;
      }
      if (!attendees.value) {
        alert('請選擇出席人數');
        attendees.focus();
        return;
      }

      // 如果選擇第三方代驗為「是」，必須填寫驗屋公司
      if (thirdParty && thirdParty.value === 'yes') {
        if (!thirdPartyCompany.value.trim()) {
          alert('請輸入第三方驗屋公司名稱');
          thirdPartyCompany.focus();
          return;
        }
      }

      // 格式化日期與時段
      var dateStr = date.value.replace(/-/g, '/');
      var timeStr = timeSlot.value;

      // 產生案件編號
      var now = new Date();
      var caseId = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(Math.floor(Math.random() * 900) + 100);

      // 建立卡片資料
      var cardData = {
        caseId: caseId,
        project: project.options[project.selectedIndex].text,
        unit: unit.options[unit.selectedIndex].text,
        date: dateStr,
        time: timeStr,
        status: '預約中',
        sortDate: date.value + ' ' + timeStr,
        attendees: attendees.value,
        designers: designers.value,
        thirdParty: thirdParty ? thirdParty.value : 'no',
        thirdPartyCompany: thirdParty && thirdParty.value === 'yes' ? thirdPartyCompany.value.trim() : ''
      };

      // 儲存至 localStorage
      var existingCards = JSON.parse(localStorage.getItem('crmInspectionCards') || '[]');
      existingCards.push(cardData);
      localStorage.setItem('crmInspectionCards', JSON.stringify(existingCards));

      // 跳轉回驗屋服務列表
      alert('預約驗屋服務已建立成功！');
      window.location.href = 'crm-inspection-service.html';
    });
  }

});
