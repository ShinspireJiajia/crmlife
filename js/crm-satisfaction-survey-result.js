/* ============================================
   滿意度調查結果頁面互動邏輯（僅供檢視）
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 從 URL 取得案件參數 ---
  var urlParams = new URLSearchParams(window.location.search);
  var caseNo = urlParams.get('no') || urlParams.get('caseId') || '';

  // --- 從 localStorage 讀取已儲存的問卷資料 ---
  var surveyData = JSON.parse(localStorage.getItem('crmSatisfactionSurvey_' + caseNo) || 'null');

  // --- 更新說明文字 ---
  var descText = document.getElementById('surveyDescText');
  if (descText && surveyData) {
    descText.textContent = '關於本次提供「個案單：' + surveyData.caseNo + '」的' + (surveyData.caseType || '修繕') + '服務，請您給予評分，您的回饋是我們改進的動力';
  }

  // --- 回填星星評分（唯讀） ---
  if (surveyData && surveyData.ratings) {
    var ratingKeys = ['overall', 'convenience', 'timeliness', 'serviceContent'];
    ratingKeys.forEach(function (key) {
      var group = document.querySelector('.star-rating[data-key="' + key + '"]');
      if (group && surveyData.ratings[key]) {
        var rating = surveyData.ratings[key];
        var stars = group.querySelectorAll('.star');
        stars.forEach(function (star) {
          var val = parseInt(star.getAttribute('data-value'));
          if (val <= rating) {
            star.classList.add('filled');
          } else {
            star.classList.remove('filled');
          }
          // 唯讀模式：移除游標樣式
          star.style.cursor = 'default';
          star.style.pointerEvents = 'none';
        });
      }
    });
  }

  // --- 確認按鈕（返回上一頁） ---
  var btnConfirm = document.getElementById('btnConfirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index.html';
      }
    });
  }

});
