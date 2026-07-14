/* ============================================
   社區周邊資訊 — 周邊資訊探索頁面邏輯
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     共用圖示（供動態產生的店家卡片使用）
     ------------------------------------------ */
  var STAR_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.4 6.5L12 16.9l-5.9 3.3 1.4-6.5-4.9-4.5 6.6-.7L12 2.5Z"></path></svg>';
  var HEART_ICON = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.6 8.7 2 5 5.6 5c2 0 3.4 1.1 4.4 2.6C11 6.1 12.4 5 14.4 5 18 5 19.4 8.7 22 11.7 19.5 16.4 12 21 12 21Z" fill="currentColor" fill-opacity="0"></path></svg>';
  var COMMENT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.5 4V16H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"></path></svg>';
  var SHARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.4"></circle><circle cx="6" cy="12" r="2.4"></circle><circle cx="18" cy="19" r="2.4"></circle><line x1="8.2" y1="10.8" x2="15.8" y2="6.2"></line><line x1="8.2" y1="13.2" x2="15.8" y2="17.8"></line></svg>';

  var CATEGORY_META = {
    bank: { label: '銀行', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 10 12 4 21 10"></polyline><line x1="4" y1="10" x2="20" y2="10"></line><line x1="4" y1="20" x2="20" y2="20"></line><line x1="6" y1="10" x2="6" y2="20"></line><line x1="10" y1="10" x2="10" y2="20"></line><line x1="14" y1="10" x2="14" y2="20"></line><line x1="18" y1="10" x2="18" y2="20"></line></svg>' },
    medical: { label: '醫療', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>' },
    food: { label: '餐廳', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="2" x2="7" y2="22"></line><path d="M4 2v6a3 3 0 0 0 6 0V2"></path><path d="M17 2c-2 0-3 2.2-3 5.5S15 13 17 13v9"></path></svg>' },
    drink: { label: '飲料', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1.4 12.2a2 2 0 0 1-2 1.8h-5.2a2 2 0 0 1-2-1.8L6 8Z"></path><line x1="9" y1="2" x2="9" y2="8"></line><line x1="15" y1="2" x2="15" y2="8"></line><line x1="6.6" y1="12" x2="17.4" y2="12"></line></svg>' },
    fruit: { label: '水果店', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4.2 0-7.5-3.4-7.5-7.6 0-3 2.1-5.4 4.3-5.4 1 0 1.9.5 3.2.5s2.2-.5 3.2-.5c2.2 0 4.3 2.4 4.3 5.4 0 4.2-3.3 7.6-7.5 7.6Z"></path><path d="M12 8c0-2 1-3.3 2.4-4.3"></path></svg>' },
    market: { label: '超市', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.1"></circle><circle cx="18" cy="20" r="1.1"></circle><path d="M2.5 4h2.3l2.3 12a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 8H6"></path></svg>' },
    convenience: { label: '超商', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 4 4h16l1 5.5"></path><path d="M3 9.5V19a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9.5"></path><path d="M9 20v-6h6v6"></path></svg>' },
    family: { label: '親子', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5.5" r="2.3"></circle><path d="M4 20c0-3.6 2.2-6.2 5-6.2s5 2.6 5 6.2"></path><circle cx="18" cy="9.5" r="1.7"></circle><path d="M15 20c0-2.6 1.4-4.5 3-4.5s3 1.9 3 4.5"></path></svg>' }
  };

  /* ------------------------------------------
     店家評論資料（demo 用，重新載入頁面即重置）
     ------------------------------------------ */
  var reviewsData = {
    '快樂小兒科診所': [
      { name: '王小姐', rating: 5, date: '2026/06/02', text: '醫生很細心，護理師也很親切，看診速度快。' },
      { name: '陳先生', rating: 5, date: '2026/05/20', text: '憑房卡免掛號費真的很方便，孩子生病時省了不少時間。' },
      { name: '林太太', rating: 4, date: '2026/04/11', text: '環境乾淨舒適，唯一缺點是候診時間有點久。' }
    ],
    '鮮果園 水果量販': [
      { name: '許先生', rating: 5, date: '2026/06/10', text: '水果新鮮又便宜，芒果特別甜！' },
      { name: '周小姐', rating: 4, date: '2026/05/28', text: '切片服務很貼心，適合小家庭購買。' }
    ],
    '暖食堂 家常料理': [
      { name: '謝先生', rating: 5, date: '2026/06/05', text: '家常菜很有水準，例湯每天不同也不會吃膩。' },
      { name: '洪小姐', rating: 4, date: '2026/05/15', text: '用餐時間人比較多，建議提早前往。' }
    ],
    '晨露茶飲': [
      { name: '范小姐', rating: 4, date: '2026/06/12', text: '茶湯香氣夠，第二杯半價很划算。' }
    ],
    '好鄰超市': [
      { name: '黃先生', rating: 5, date: '2026/06/15', text: '晚上生鮮特價撿到不少便宜，品項也齊全。' },
      { name: '李小姐', rating: 4, date: '2026/05/30', text: '停車不太方便，但商品很齊全。' },
      { name: '吳太太', rating: 5, date: '2026/05/02', text: '結帳速度快，員工服務態度很好。' }
    ],
    '童樂繪本親子館': [
      { name: '鄭太太', rating: 5, date: '2026/06/08', text: '孩子超喜歡這裡的繪本和活動，老師也很有耐心。' }
    ]
  };

  /* ------------------------------------------
     DOM 元素參照
     ------------------------------------------ */
  var categoryGrid = document.getElementById('categoryGrid');
  var storeList = document.getElementById('storeList');
  var rangeSelect = document.getElementById('rangeSelect');
  var emptyState = document.getElementById('emptyState');
  var resultCount = document.getElementById('resultCount');

  var favToggleCard = document.getElementById('btnFavToggle');
  var favToggleText = document.getElementById('btnFavToggleText');

  var btnSearchToggle = document.getElementById('btnSearchToggle');
  var activeSearchChip = document.getElementById('activeSearchChip');
  var activeSearchChipText = document.getElementById('activeSearchChipText');
  var btnClearSearch = document.getElementById('btnClearSearch');

  var searchModalOverlay = document.getElementById('searchModalOverlay');
  var searchModalInput = document.getElementById('searchModalInput');
  var searchModalSubmit = document.getElementById('searchModalSubmit');
  var searchModalClose = document.getElementById('searchModalClose');

  var commentModalOverlay = document.getElementById('commentModalOverlay');
  var commentModalTitle = document.getElementById('commentModalTitle');
  var commentModalClose = document.getElementById('commentModalClose');
  var commentSummaryScore = document.getElementById('commentSummaryScore');
  var commentSummaryStars = document.getElementById('commentSummaryStars');
  var commentSummaryCount = document.getElementById('commentSummaryCount');
  var commentList = document.getElementById('commentList');
  var commentFormRating = document.getElementById('commentFormRating');
  var commentInput = document.getElementById('commentInput');
  var commentSubmitBtn = document.getElementById('commentSubmitBtn');

  var btnAddStore = document.getElementById('btnAddStore');
  var storeFormModalOverlay = document.getElementById('storeFormModalOverlay');
  var storeFormModalClose = document.getElementById('storeFormModalClose');
  var storeForm = document.getElementById('storeForm');
  var newStoreName = document.getElementById('newStoreName');
  var newStoreCategory = document.getElementById('newStoreCategory');
  var newStoreAddress = document.getElementById('newStoreAddress');
  var newStoreTag = document.getElementById('newStoreTag');
  var newStoreDesc = document.getElementById('newStoreDesc');

  /* ------------------------------------------
     篩選狀態
     ------------------------------------------ */
  var currentCategory = 'all';
  var currentKeyword = '';
  var currentRange = rangeSelect ? parseInt(rangeSelect.value, 10) : 3000;
  var favoritesOnly = false;

  var activeCommentStore = null;
  var selectedRating = 0;

  /* ------------------------------------------
     小工具
     ------------------------------------------ */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate());
  }

  function buildStars(rating) {
    var rounded = Math.round(rating);
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += '<span class="' + (i <= rounded ? 'is-filled' : '') + '">' + STAR_ICON + '</span>';
    }
    return out;
  }

  function showModal(overlay) { if (overlay) overlay.classList.add('is-active'); }
  function closeModal(overlay) { if (overlay) overlay.classList.remove('is-active'); }

  // 點擊遮罩背景（非內容區）時關閉
  [searchModalOverlay, commentModalOverlay, storeFormModalOverlay].forEach(function (overlay) {
    if (!overlay) return;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  function getStats(name) {
    var list = reviewsData[name] || [];
    var count = list.length;
    var avg = count ? list.reduce(function (s, r) { return s + r.rating; }, 0) / count : 0;
    return { avg: avg, count: count };
  }

  function updateCardRatingDisplay(name) {
    var stats = getStats(name);
    var card = findCardByName(name);
    if (!card) return;
    var ratingText = card.querySelector('.rating-text');
    if (!ratingText) return;
    ratingText.textContent = stats.count ? stats.avg.toFixed(1) + ' (' + stats.count + '則評論)' : '尚無評論';
  }

  function findCardByName(name) {
    var cards = storeList.querySelectorAll('.store-card');
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-name') === name) return cards[i];
    }
    return null;
  }

  /* ------------------------------------------
     分類篩選
     ------------------------------------------ */
  if (categoryGrid) {
    var categoryItems = categoryGrid.querySelectorAll('.category-item');
    categoryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var category = item.getAttribute('data-category');
        if (currentCategory === category) {
          currentCategory = 'all';
          item.classList.remove('active');
        } else {
          categoryItems.forEach(function (i) { i.classList.remove('active'); });
          item.classList.add('active');
          currentCategory = category;
        }
        filterStores();
      });
    });
  }

  /* ------------------------------------------
     範圍篩選
     ------------------------------------------ */
  if (rangeSelect) {
    rangeSelect.addEventListener('change', function () {
      currentRange = parseInt(rangeSelect.value, 10);
      filterStores();
    });
  }

  /* ------------------------------------------
     搜尋（Modal 輸入）
     ------------------------------------------ */
  function updateSearchChip() {
    if (!activeSearchChip) return;
    if (currentKeyword) {
      activeSearchChip.hidden = false;
      if (activeSearchChipText) activeSearchChipText.textContent = '搜尋：' + currentKeyword;
    } else {
      activeSearchChip.hidden = true;
    }
  }

  function applySearch() {
    currentKeyword = (searchModalInput.value || '').trim().toLowerCase();
    updateSearchChip();
    filterStores();
    closeModal(searchModalOverlay);
  }

  if (btnSearchToggle) {
    btnSearchToggle.addEventListener('click', function () {
      searchModalInput.value = currentKeyword;
      showModal(searchModalOverlay);
      setTimeout(function () { searchModalInput.focus(); }, 100);
    });
  }

  if (searchModalClose) {
    searchModalClose.addEventListener('click', function () { closeModal(searchModalOverlay); });
  }

  if (searchModalSubmit) {
    searchModalSubmit.addEventListener('click', applySearch);
  }

  if (searchModalInput) {
    searchModalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearch();
      }
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', function () {
      currentKeyword = '';
      searchModalInput.value = '';
      updateSearchChip();
      filterStores();
    });
  }

  /* ------------------------------------------
     我的收藏店家 -> 切換僅顯示收藏
     ------------------------------------------ */
  if (favToggleCard) {
    favToggleCard.addEventListener('click', function () {
      favoritesOnly = !favoritesOnly;
      favToggleCard.classList.toggle('active', favoritesOnly);
      if (favToggleText) {
        favToggleText.textContent = favoritesOnly ? '顯示全部店家' : '我的收藏店家';
      }
      filterStores();
    });
  }

  /* ------------------------------------------
     篩選店家清單
     ------------------------------------------ */
  function filterStores() {
    if (!storeList) return;
    var cards = storeList.querySelectorAll('.store-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var matchCategory = (currentCategory === 'all') || (card.getAttribute('data-category') === currentCategory);
      var distanceAttr = card.getAttribute('data-distance');
      var matchRange = !distanceAttr || parseInt(distanceAttr, 10) <= currentRange;
      var matchFav = !favoritesOnly || card.getAttribute('data-fav') === 'true';
      var matchKeyword = true;

      if (currentKeyword) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var desc = (card.querySelector('.store-desc') || {}).textContent || '';
        matchKeyword = name.indexOf(currentKeyword) !== -1 || desc.toLowerCase().indexOf(currentKeyword) !== -1;
      }

      if (matchCategory && matchRange && matchFav && matchKeyword) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultCount) {
      resultCount.textContent = visibleCount > 0 ? visibleCount + ' 間店家' : '';
    }

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  /* ------------------------------------------
     店家卡片內互動（收藏 / 評論 / 分享）— 事件委派
     ------------------------------------------ */
  if (storeList) {
    storeList.addEventListener('click', function (e) {
      var favBtn = e.target.closest('.action-btn.fav');
      if (favBtn) { toggleFav(favBtn); return; }

      var commentBtn = e.target.closest('.comment-btn');
      if (commentBtn) { openCommentModal(commentBtn.getAttribute('data-name') || ''); return; }

      var shareBtn = e.target.closest('.share-btn');
      if (shareBtn) { shareStore(shareBtn.getAttribute('data-name') || ''); }
    });
  }

  function toggleFav(btn) {
    var card = btn.closest('.store-card');
    var isActive = btn.classList.toggle('active');
    card.setAttribute('data-fav', isActive ? 'true' : 'false');

    var textEl = btn.querySelector('.btn-text');
    if (textEl) textEl.textContent = isActive ? '已收藏' : '收藏';

    if (favoritesOnly) filterStores();
  }

  function shareStore(name) {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: '推薦社區周邊店家：' + name,
        url: window.location.href
      }).catch(function () {});
    } else {
      alert('分享給鄰居：' + name);
    }
  }

  /* ------------------------------------------
     店家評論 Modal
     ------------------------------------------ */
  function renderCommentSummary(name) {
    var stats = getStats(name);
    commentSummaryScore.textContent = stats.count ? stats.avg.toFixed(1) : '—';
    commentSummaryStars.innerHTML = buildStars(stats.avg);
    commentSummaryCount.textContent = stats.count + ' 則評論';
  }

  function renderCommentList(name) {
    var list = reviewsData[name] || [];
    if (!list.length) {
      commentList.innerHTML = '<p class="comment-empty">尚無評論，成為第一位分享心得的鄰居！</p>';
      return;
    }
    commentList.innerHTML = list.map(function (r) {
      return '<div class="comment-item">' +
        '<div class="comment-item-head"><span class="comment-item-name">' + escapeHtml(r.name) + '</span><span class="comment-item-date">' + escapeHtml(r.date) + '</span></div>' +
        '<div class="comment-item-stars">' + buildStars(r.rating) + '</div>' +
        '<p class="comment-item-text">' + escapeHtml(r.text) + '</p>' +
        '</div>';
    }).join('');
  }

  function resetCommentForm() {
    selectedRating = 0;
    updateRatingButtons();
    if (commentInput) commentInput.value = '';
  }

  function updateRatingButtons() {
    if (!commentFormRating) return;
    var btns = commentFormRating.querySelectorAll('button');
    btns.forEach(function (b) {
      b.classList.toggle('active', parseInt(b.getAttribute('data-value'), 10) <= selectedRating);
    });
  }

  // 產生 5 顆評分星星（僅需初始化一次）
  if (commentFormRating) {
    var ratingHtml = '';
    for (var i = 1; i <= 5; i++) {
      ratingHtml += '<button type="button" data-value="' + i + '" aria-label="' + i + ' 星">' + STAR_ICON + '</button>';
    }
    commentFormRating.innerHTML = ratingHtml;
    commentFormRating.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      selectedRating = parseInt(btn.getAttribute('data-value'), 10);
      updateRatingButtons();
    });
  }

  function openCommentModal(name) {
    if (!name) return;
    activeCommentStore = name;
    commentModalTitle.textContent = name + ' 的評論';
    renderCommentSummary(name);
    renderCommentList(name);
    resetCommentForm();
    showModal(commentModalOverlay);
  }

  if (commentModalClose) {
    commentModalClose.addEventListener('click', function () { closeModal(commentModalOverlay); });
  }

  if (commentSubmitBtn) {
    commentSubmitBtn.addEventListener('click', function () {
      if (!activeCommentStore) return;
      if (!selectedRating) { alert('請先選擇評分星數'); return; }
      var text = (commentInput.value || '').trim();
      if (!text) { alert('請輸入評論內容'); return; }

      var list = reviewsData[activeCommentStore] || (reviewsData[activeCommentStore] = []);
      list.unshift({ name: '您', rating: selectedRating, date: todayStr(), text: text });

      renderCommentSummary(activeCommentStore);
      renderCommentList(activeCommentStore);
      updateCardRatingDisplay(activeCommentStore);
      resetCommentForm();
    });
  }

  /* ------------------------------------------
     新增店家
     ------------------------------------------ */
  function createStoreCard(data) {
    var meta = CATEGORY_META[data.category];
    var tagHtml = '';
    if (data.tag === 'new') tagHtml = ' <span class="tag">新開幕</span>';
    else if (data.tag === 'featured') tagHtml = ' <span class="tag featured">社區特約</span>';

    var safeName = escapeHtml(data.name);
    var card = document.createElement('div');
    card.className = 'store-card';
    card.setAttribute('data-category', data.category);
    card.setAttribute('data-name', data.name);
    card.setAttribute('data-fav', 'false');

    card.innerHTML =
      '<div class="store-header"><div class="store-info">' +
        '<h3>' + safeName + tagHtml + '</h3>' +
        '<div class="store-meta">' +
          '<span class="meta-item"><span class="meta-icon">' + meta.icon + '</span>' + meta.label + '</span>' +
          '<span class="meta-item"><span class="meta-icon"><img src="assets/location-icon.svg" alt=""></span>' + escapeHtml(data.address) + '</span>' +
          '<span class="meta-item rating-star"><span class="meta-icon">' + STAR_ICON + '</span><span class="rating-text">尚無評論</span></span>' +
        '</div>' +
      '</div></div>' +
      '<p class="store-desc">' + escapeHtml(data.desc || '住戶新增的周邊店家資訊。') + '</p>' +
      '<div class="store-actions">' +
        '<button class="action-btn fav" data-name="' + safeName + '">' +
          '<span class="btn-icon icon-fav">' + HEART_ICON + '</span><span class="btn-text">收藏</span>' +
        '</button>' +
        '<button class="action-btn comment-btn" data-name="' + safeName + '">' +
          '<span class="btn-icon">' + COMMENT_ICON + '</span>評論' +
        '</button>' +
        '<button class="action-btn share-btn" data-name="' + safeName + '">' +
          '<span class="btn-icon">' + SHARE_ICON + '</span>分享' +
        '</button>' +
      '</div>';

    return card;
  }

  if (btnAddStore) {
    btnAddStore.addEventListener('click', function () {
      storeForm.reset();
      showModal(storeFormModalOverlay);
    });
  }

  if (storeFormModalClose) {
    storeFormModalClose.addEventListener('click', function () { closeModal(storeFormModalOverlay); });
  }

  if (storeForm) {
    storeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = newStoreName.value.trim();
      var category = newStoreCategory.value;
      var address = newStoreAddress.value.trim();

      if (!name || !category || !address) {
        alert('請完整填寫店家名稱、分類與地址');
        return;
      }

      var card = createStoreCard({
        name: name,
        category: category,
        address: address,
        tag: newStoreTag.value,
        desc: newStoreDesc.value.trim()
      });

      storeList.insertBefore(card, storeList.firstChild);
      storeForm.reset();
      closeModal(storeFormModalOverlay);
      filterStores();
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // 初始化：顯示全部店家
  filterStores();

})();
