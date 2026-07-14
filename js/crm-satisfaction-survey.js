/* ============================================
   滿意度調查頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:3825)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 從 URL 取得案件相關參數 ---
  var urlParams = new URLSearchParams(window.location.search);
  var caseNo = urlParams.get('no') || urlParams.get('caseId') || '';
  var caseType = urlParams.get('type') || '修繕';

  // --- 根據案件編號更新說明文字 ---
  var descText = document.getElementById('surveyDescText');
  if (descText && caseNo) {
    descText.textContent = '關於本次提供「個案單：' + caseNo + '」的' + caseType + '服務，請您給予評分，您的回饋是我們改進的動力';
  }

  // --- 星星評分邏輯 ---
  var ratingGroups = document.querySelectorAll('.star-rating');
  // 儲存各項評分值（key → rating）
  var ratings = {};

  ratingGroups.forEach(function (group) {
    var key = group.getAttribute('data-key');
    ratings[key] = 0;
    var stars = group.querySelectorAll('.star');

    // 更新星星顯示
    function updateStars(rating) {
      ratings[key] = rating;
      stars.forEach(function (star) {
        var val = parseInt(star.getAttribute('data-value'));
        if (val <= rating) {
          star.classList.add('filled');
        } else {
          star.classList.remove('filled');
        }
      });
    }

    // 點擊星星設定評分
    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        var val = parseInt(star.getAttribute('data-value'));
        updateStars(val);
        // 清除該項的錯誤訊息
        var errorMsg = group.parentElement.querySelector('.error-msg');
        if (errorMsg) errorMsg.classList.remove('show');
      });
    });
  });

  // --- 離開按鈕 ---
  var btnLeave = document.getElementById('btnLeave');
  if (btnLeave) {
    btnLeave.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index_life.html';
      }
    });
  }

  // --- 確認送出按鈕 ---
  var btnSubmit = document.getElementById('btnSubmit');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {

      // 驗證所有評分項是否已填寫
      var hasError = false;
      ratingGroups.forEach(function (group) {
        var key = group.getAttribute('data-key');
        var errorMsg = group.parentElement.querySelector('.error-msg');
        if (ratings[key] === 0) {
          hasError = true;
          // 如尚無錯誤訊息元素則動態建立
          if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'error-msg';
            errorMsg.textContent = '請給予評分';
            group.parentElement.appendChild(errorMsg);
          }
          errorMsg.classList.add('show');
        } else if (errorMsg) {
          errorMsg.classList.remove('show');
        }
      });

      if (hasError) return;

      // 收集複選題答案
      var satisfiedAspects = [];
      document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked').forEach(function (cb) {
        satisfiedAspects.push(cb.value);
      });

      // 收集單選題答案
      var recommendationEl = document.querySelector('.radio-group input[type="radio"]:checked');
      var recommendation = recommendationEl ? recommendationEl.value : '';

      // 收集單行輸入框答案
      var commentEl = document.getElementById('surveyComment');
      var comment = commentEl ? commentEl.value.trim() : '';

      // 組裝問卷資料
      var surveyData = {
        caseNo: caseNo,
        caseType: caseType,
        ratings: ratings,
        satisfiedAspects: satisfiedAspects,
        recommendation: recommendation,
        comment: comment,
        submittedAt: new Date().toISOString()
      };

      // 儲存至 localStorage（供結果頁檢視）
      localStorage.setItem('crmSatisfactionSurvey_' + caseNo, JSON.stringify(surveyData));

      // 顯示成功提示後返回
      alert('感謝您的回饋！問卷已送出。');

      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index_life.html';
      }
    });
  }

});
