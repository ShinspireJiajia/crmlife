/* ============================================
   基金會美學活動內頁互動邏輯
   根據 PDF 規格：Chapter 8 美學活動
   手機版為主（max-width: 430px）
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mock 基金會活動資料 --- */
  var foundationEventData = {
    'foundation-nature-sound': {
      status: 'available',
      image: 'assets/event-image-forest.png',
      title: '聆聽寂靜：追尋自然聲景',
      subtitle: '台灣聲景協會 創辦人．范欽慧',
      category: '生態',
      date: '2022.09.24',
      time: '14:30-16:00',
      locationName: '植深館',
      locationAddr: '臺中市南屯區公益路二段789號',
      mapUrl: 'https://maps.google.com/?q=%E8%87%BA%E4%B8%AD%E5%B8%82%E5%8D%97%E5%B1%AF%E5%8D%80%E5%85%AC%E7%9B%8A%E8%B7%AF%E4%BA%8C%E6%AE%B5789%E8%99%9F',
      phone: '0800-524365',
      phoneNote: '週二至週日10:00-18:00',
      fee: '200元/位',
      capacity: '40位',
      capacityNote: '每場次人數',
      age: '16歲以上',
      residentOnly: true,
      showForm: true,
      description: [
        '晨曦逐漸照亮原野，鐵杉林上，顴胸鶇簡輕聲嘶啞，冠羽畫眉喋喋咕咕，聆聽自然聲景，是一位野地錄音師的日常體會。',
        '',
        '活動邀請促成臺灣與國際接軌，成功爭取宜蘭翠峰湖環山步道成為全球第一條寂靜山徑的野地錄音師．范欽慧，分享如何打開感官聆聽自然和鳴中的「寂靜」，在高度視覺化時代裡，創造身體與聲音的互動連結，探索聲景文化，感受聲命力。'
      ],
      gallery: [
        { type: 'image', src: 'assets/event-image-forest.png', caption: '圖片說明' },
        { type: 'image', src: 'assets/event-image-nature.png', caption: '活動現場' },
        { type: 'video', src: 'assets/event-image-nature.png', caption: '影片示範', youtubeId: 'oEJflk1RrH0' }
      ],
      youtubeId: '',
      payment: '請由「活動報名」填妥您的資料，主辦單位將於三日內發送報名確認函及繳費方式至您的電子信箱，請於收到通知後進行繳費以完成報名。',
      notice: [
        '完成報名繳費後請恕無法取消報名',
        '每場次開放報名至額滿截止',
        '主辦單位將視疫情，保留調整活動舉辦方式之彈性'
      ]
    },
    'foundation-fern-class': {
      status: 'full',
      image: 'assets/event-image-nature.png',
      title: '植蕨系．蕨類上板教學',
      subtitle: '陸府綠海專業團隊',
      category: '生態',
      date: '2022.09.17',
      time: '14:30-16:00',
      locationName: '植深館',
      locationAddr: '臺中市南屯區公益路二段789號',
      mapUrl: 'https://maps.google.com/?q=%E8%87%BA%E4%B8%AD%E5%B8%82%E5%8D%97%E5%B1%AF%E5%8D%80%E5%85%AC%E7%9B%8A%E8%B7%AF%E4%BA%8C%E6%AE%B5789%E8%99%9F',
      phone: '0800-524365',
      phoneNote: '週二至週日10:00-18:00',
      fee: '免費',
      capacity: '30位',
      capacityNote: '每場次人數',
      age: '不限',
      residentOnly: false,
      showForm: true,
      description: [
        '蕨類植物是地球上最古老的維管束植物之一，它們靜靜地在森林的角落展開翠綠的葉片，以獨特的姿態詮釋生命的韌性。',
        '',
        '本次課程邀請陸府綠海專業團隊，帶領參與者認識常見的蕨類品種，並親手體驗將蕨類上板的園藝技巧，打造屬於自己的綠意裝飾。'
      ],
      gallery: [
        { type: 'image', src: 'assets/event-image-nature.png', caption: '蕨類上板教學' }
      ],
      youtubeId: '',
      payment: '',
      notice: [
        '每場次開放報名至額滿截止',
        '主辦單位將視疫情，保留調整活動舉辦方式之彈性'
      ]
    }
  };

  /* --- DOM 元素取得 --- */
  var btnAction = document.getElementById('btnAction');
  var detailBannerImg = document.querySelector('#detailBannerImg img');
  var detailTitle = document.getElementById('detailTitle');
  var detailSubtitle = document.getElementById('detailSubtitle');
  var detailDate = document.getElementById('detailDate');
  var detailTime = document.getElementById('detailTime');
  var detailLocationName = document.getElementById('detailLocationName');
  var detailLocationAddr = document.getElementById('detailLocationAddr');
  var detailMapLink = document.getElementById('detailMapLink');
  var detailPhone = document.getElementById('detailPhone');
  var detailPhoneNote = document.getElementById('detailPhoneNote');
  var detailFee = document.getElementById('detailFee');
  var detailCapacity = document.getElementById('detailCapacity');
  var detailCapacityNote = document.getElementById('detailCapacityNote');
  var detailAge = document.getElementById('detailAge');
  var detailDescription = document.getElementById('detailDescription');
  var detailGallery = document.getElementById('detailGallery');
  var detailVideo = document.getElementById('detailVideo');
  var detailVideoIframe = document.getElementById('detailVideoIframe');
  var detailPayment = document.getElementById('detailPayment');
  var detailPaymentSection = document.getElementById('detailPaymentSection');
  var detailNotice = document.getElementById('detailNotice');
  var detailNoticeSection = document.getElementById('detailNoticeSection');

  /* --- 燈箱元素與狀態 --- */
  var galleryLightbox = document.getElementById('galleryLightbox');
  var lightboxOverlay = document.getElementById('lightboxOverlay');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var lightboxImages = [];
  var lightboxIndex = 0;

  function updateLightboxState() {
    var multiImg = lightboxImages.length > 1;
    if (lightboxPrev) lightboxPrev.style.display = multiImg ? '' : 'none';
    if (lightboxNext) lightboxNext.style.display = multiImg ? '' : 'none';
    if (lightboxCounter) {
      if (multiImg) {
        lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + lightboxImages.length;
        lightboxCounter.style.display = '';
      } else {
        lightboxCounter.style.display = 'none';
      }
    }
  }

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = lightboxImages[index].src;
    lightboxImg.alt = lightboxImages[index].alt;
    updateLightboxState();
    galleryLightbox.classList.add('is-open');
  }

  function closeLightbox() {
    galleryLightbox.classList.remove('is-open');
  }

  function showPrev() {
    if (lightboxImages.length < 2) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    updateLightboxState();
  }

  function showNext() {
    if (lightboxImages.length < 2) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex].src;
    lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    updateLightboxState();
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrev);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }

  /* --- 鍵盤支援 --- */
  document.addEventListener('keydown', function (e) {
    if (!galleryLightbox || !galleryLightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeLightbox(); }
    else if (e.key === 'ArrowLeft') { showPrev(); }
    else if (e.key === 'ArrowRight') { showNext(); }
  });

  /* --- 觸控滑動支援 --- */
  var touchStartX = 0;
  if (galleryLightbox) {
    galleryLightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    galleryLightbox.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) { showNext(); } else { showPrev(); }
      }
    }, { passive: true });
  }

  /* --- 取得 URL 參數中的活動 ID --- */
  var urlParams = new URLSearchParams(window.location.search);
  var eventId = urlParams.get('id') || 'foundation-nature-sound';

  /* --- 根據活動 ID 載入資料 --- */
  var currentEvent = foundationEventData[eventId];
  if (currentEvent) {
    renderEvent(currentEvent);
  }

  /**
   * 根據活動資料渲染頁面內容
   * @param {Object} event - 活動資料物件
   */
  function renderEvent(event) {
    // 設定活動圖片
    if (detailBannerImg) {
      detailBannerImg.src = event.image;
      detailBannerImg.alt = event.title;
    }

    // 設定活動標題
    if (detailTitle) {
      detailTitle.textContent = event.title;
    }

    // 設定副標題
    if (detailSubtitle) {
      detailSubtitle.textContent = event.subtitle;
    }

    // 設定日期
    if (detailDate) {
      detailDate.textContent = event.date;
    }

    // 設定時間
    if (detailTime) {
      detailTime.textContent = event.time;
    }

    // 設定地點
    if (detailLocationName) {
      detailLocationName.textContent = event.locationName;
    }
    if (detailLocationAddr) {
      detailLocationAddr.textContent = event.locationAddr;
    }

    // 設定 Google Map 連結
    if (detailMapLink && event.mapUrl) {
      detailMapLink.href = event.mapUrl;
      detailMapLink.style.display = '';
    } else if (detailMapLink) {
      detailMapLink.style.display = 'none';
    }

    // 設定客服電話
    if (detailPhone) {
      detailPhone.textContent = event.phone;
    }
    if (detailPhoneNote) {
      detailPhoneNote.textContent = event.phoneNote;
    }

    // 設定活動費用（單一金額）
    if (detailFee) {
      detailFee.textContent = event.fee;
    }

    // 設定場次名額
    if (detailCapacity) {
      detailCapacity.textContent = event.capacity;
    }
    if (detailCapacityNote) {
      detailCapacityNote.textContent = event.capacityNote;
    }

    // 設定建議年齡
    if (detailAge) {
      detailAge.textContent = event.age;
    }

    // 設定描述內容
    if (detailDescription && event.description) {
      detailDescription.innerHTML = '';
      event.description.forEach(function (paragraph) {
        var p = document.createElement('p');
        if (paragraph === '') {
          p.innerHTML = '&nbsp;';
        } else {
          p.textContent = paragraph;
        }
        detailDescription.appendChild(p);
      });
    }

    // 設定圖片 gallery
    lightboxImages = [];
    if (detailGallery && event.gallery && event.gallery.length > 0) {
      detailGallery.innerHTML = '';
      event.gallery.forEach(function (item) {
        var div = document.createElement('div');

        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.caption || '';
        img.loading = 'lazy';
        div.appendChild(img);

        if (item.type === 'video') {
          div.className = 'gallery-item gallery-item-video';
          var playIcon = document.createElement('div');
          playIcon.className = 'gallery-play-icon';
          playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="rgba(0,0,0,0.4)"/><path d="M12 9l12 7-12 7V9z" fill="#fff"/></svg>';
          div.appendChild(playIcon);

          if (item.youtubeId) {
            div.addEventListener('click', function () {
              showYoutubeVideo(item.youtubeId);
            });
          }
        } else {
          div.className = 'gallery-item gallery-item-image';
          var imgIdx = lightboxImages.length;
          lightboxImages.push({ src: item.src, alt: item.caption || '' });
          (function (idx) {
            div.addEventListener('click', function () {
              openLightbox(idx);
            });
          })(imgIdx);
        }

        if (item.caption) {
          var caption = document.createElement('p');
          caption.className = 'gallery-caption';
          caption.textContent = item.caption;
          div.appendChild(caption);
        }

        detailGallery.appendChild(div);
      });
      detailGallery.style.display = '';
    } else if (detailGallery) {
      detailGallery.style.display = 'none';
    }

    // 設定 YouTube 影片（主影片）
    if (event.youtubeId && detailVideo && detailVideoIframe) {
      detailVideoIframe.src = 'https://www.youtube.com/embed/' + event.youtubeId;
      detailVideo.style.display = '';
    }

    // 設定付費方式
    if (detailPaymentSection) {
      if (event.payment) {
        detailPayment.innerHTML = '<p>' + event.payment + '</p>';
        detailPaymentSection.style.display = '';
      } else {
        detailPaymentSection.style.display = 'none';
      }
    }

    // 設定注意事項
    if (detailNoticeSection) {
      if (event.notice && event.notice.length > 0) {
        var ul = document.createElement('ul');
        event.notice.forEach(function (item) {
          var li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        detailNotice.innerHTML = '';
        detailNotice.appendChild(ul);
        detailNoticeSection.style.display = '';
      } else {
        detailNoticeSection.style.display = 'none';
      }
    }

    // 設定底部按鈕狀態
    if (btnAction) {
      if (event.status === 'available' && event.showForm) {
        btnAction.textContent = '活動報名';
        btnAction.className = 'btn-action btn-action-available';
        btnAction.disabled = false;
      } else if (event.status === 'full') {
        btnAction.textContent = '報名額滿';
        btnAction.className = 'btn-action btn-action-full';
        btnAction.disabled = true;
      } else {
        // 無報名功能時隱藏按鈕
        btnAction.style.display = 'none';
      }
    }
  }

  /**
   * 顯示 YouTube 影片嵌入
   * @param {string} youtubeId - YouTube 影片 ID
   */
  function showYoutubeVideo(youtubeId) {
    if (detailVideo && detailVideoIframe) {
      detailVideoIframe.src = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1';
      detailVideo.style.display = '';
      // 捲動到影片位置
      detailVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* --- 報名按鈕點擊事件 --- */
  if (btnAction) {
    btnAction.addEventListener('click', function () {
      if (currentEvent && currentEvent.status === 'available' && currentEvent.showForm) {
        // 導向預約表單頁（可依需求調整目標頁面）
        window.location.href = 'crm-forest-reserve.html?id=' + eventId;
      }
    });
  }

});
