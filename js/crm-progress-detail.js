/* ============================================
   建案工程進度內頁互動邏輯
   根據 URL 參數 id 載入對應工程進度資料
   顯示進度說明、更新日期與完工進度照片
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mock 資料 ---
  var progressItems = {
    p001: {
      name: '6FL板金查驗',
      description: '如期完工，如圖',
      updateDate: '2025.07.01',
      photos: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=225&fit=crop'
      ]
    },
    p002: {
      name: '機車區牆磚施作',
      description: '施工中，進度正常',
      updateDate: '2025.06.15',
      photos: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=225&fit=crop',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=225&fit=crop'
      ]
    },
    p003: {
      name: '戶內木門門框施作',
      description: '施工中，進度正常',
      updateDate: '2025.06.10',
      photos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=225&fit=crop'
      ]
    }
  };

  // --- 取得 URL 參數 ---
  var urlParams = new URLSearchParams(window.location.search);
  var progressId = urlParams.get('id') || 'p001';

  // --- DOM 元素 ---
  var pageTitle = document.querySelector('.page-title');
  var mainContent = document.getElementById('mainContent');
  var lightboxOverlay = document.getElementById('lightboxOverlay');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxImg = document.getElementById('lightboxImg');

  // --- 進度說明圖示（剪貼板） SVG --- 
  var clipboardIconSvg =
    '<svg class="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="2" y="3" width="16" height="15" rx="2" stroke="#3a4246" stroke-width="1.5" fill="none"/>' +
      '<line x1="2" y1="8" x2="18" y2="8" stroke="#3a4246" stroke-width="1.5"/>' +
      '<rect x="6" y="1" width="8" height="4" rx="1" stroke="#3a4246" stroke-width="1.5" fill="none"/>' +
    '</svg>';

  // --- 更新日期圖示（日曆） SVG ---
  var calendarIconSvg =
    '<svg class="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="1" y="3" width="18" height="15" rx="2" stroke="#3a4246" stroke-width="1.5" fill="none"/>' +
      '<line x1="1" y1="8" x2="19" y2="8" stroke="#3a4246" stroke-width="1.5"/>' +
      '<line x1="5" y1="1" x2="5" y2="5" stroke="#3a4246" stroke-width="1.5" stroke-linecap="round"/>' +
      '<line x1="15" y1="1" x2="15" y2="5" stroke="#3a4246" stroke-width="1.5" stroke-linecap="round"/>' +
      '<text x="7" y="15" font-size="7" font-weight="bold" fill="#b8a676">1</text>' +
    '</svg>';

  // --- 渲染頁面 ---
  function renderDetail() {
    var data = progressItems[progressId];
    if (!data) {
      mainContent.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">' +
            '<img src="assets/empty-record-icon.svg" alt="">' +
          '</div>' +
          '<p class="empty-text">找不到工程進度資料</p>' +
        '</div>';
      return;
    }

    // 設定頁面標題
    pageTitle.textContent = data.name;

    var html = '';

    // 進度說明卡片
    html += '<div class="info-card">' +
      '<div class="info-card-label">' +
        clipboardIconSvg +
        '<span>進度說明</span>' +
      '</div>' +
      '<span class="info-card-value">' + data.description + '</span>' +
    '</div>';

    // 更新日期卡片
    html += '<div class="info-card">' +
      '<div class="info-card-label">' +
        calendarIconSvg +
        '<span>更新日期</span>' +
      '</div>' +
      '<span class="info-card-value">' + data.updateDate + '</span>' +
    '</div>';

    // 完工進度分享卡片（照片）
    if (data.photos && data.photos.length > 0) {
      html += '<div class="photo-card">' +
        '<p class="photo-card-title">完工進度分享</p>' +
        '<div class="photo-grid">';

      for (var i = 0; i < data.photos.length; i++) {
        html += '<div class="photo-item" data-index="' + i + '">' +
          '<img src="' + encodeURI(data.photos[i]) + '" alt="進度照片 ' + (i + 1) + '">' +
        '</div>';
      }

      html += '</div></div>';
    }

    mainContent.innerHTML = html;
  }

  // --- 燈箱功能 ---
  function openLightbox(src) {
    lightboxImg.src = src;
    lightboxOverlay.classList.add('active');
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    lightboxImg.src = '';
  }

  // 照片點擊開啟燈箱
  mainContent.addEventListener('click', function (e) {
    var photoItem = e.target.closest('.photo-item');
    if (photoItem) {
      var img = photoItem.querySelector('img');
      if (img) {
        openLightbox(img.src);
      }
    }
  });

  // 關閉燈箱
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', function (e) {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // --- 初始渲染 ---
  renderDetail();

});
