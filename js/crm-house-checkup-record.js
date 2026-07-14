/* ============================================
   房屋健診 - 已完成檢視紀錄頁面互動邏輯
   根據 Figma 設計稿 (node-id: 248:1811)
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

  // --- 首頁按鈕 ---
  var btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'crm-index phase1.html';
    });
  }

  // --- 簽名功能（使用共用元件） ---
  SignaturePadComponent.init({
    mountId: 'signatureMount',
    mode: 'overlay',
    storageKey: 'crmHouseCheckupSignature'
  });

  // --- 滿意度問卷按鈕 ---
  var btnSurvey = document.getElementById('btnSurvey');
  if (btnSurvey) {
    btnSurvey.addEventListener('click', function () {
      // 導向滿意度問卷頁面
      var urlParams = new URLSearchParams(window.location.search);
      var caseId = urlParams.get('caseId') || '';
      window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(caseId) + '&type=' + encodeURIComponent('房屋健檢');
    });
  }

  // --- 下載附件按鈕 ---
  document.querySelectorAll('[data-action="download"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fileName = btn.getAttribute('data-file');
      console.log('下載附件：' + fileName);
    });
  });

});
