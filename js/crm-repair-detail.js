/* ============================================
   報修單內容查看頁面互動邏輯
   根據 Figma 設計稿 (node-id: 252:2645)
   參照 crm-view-record.js 規則
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 從 URL 參數讀取狀態，預設為「已完成」 ---
  var urlParams = new URLSearchParams(window.location.search);
  var currentStatus = urlParams.get('status') || '已完成';

  // --- 根據狀態設置 Badge 樣式 ---
  var statusBadge = document.getElementById('statusBadge');
  if (statusBadge) {
    if (currentStatus === '已完成') {
      statusBadge.classList.add('status-done');
      statusBadge.querySelector('span').textContent = '已完成';
    } else if (currentStatus === '處理中') {
      statusBadge.classList.add('status-processing');
      statusBadge.querySelector('span').textContent = '處理中';
    }
  }

  // --- 根據狀態控制完工資訊、簽名區塊、問卷按鈕顯示 ---
  var completionInfo = document.getElementById('completionInfo');
  var signatureSection = document.getElementById('signatureMount');
  var surveySection = document.getElementById('surveySection');

  if (currentStatus !== '已完成') {
    if (completionInfo) completionInfo.style.display = 'none';
    if (signatureSection) signatureSection.style.display = 'none';
    if (surveySection) surveySection.style.display = 'none';
    // 隱藏分隔線（完工資訊上方的分隔線）
    var cardDivider = document.querySelector('.card-divider');
    if (cardDivider) cardDivider.style.display = 'none';
  }

  // --- 根據狀態設定留言板區段標題 ---
  var chatSectionTitle = document.getElementById('chatSectionTitle');
  if (chatSectionTitle) {
    if (currentStatus === '處理中') {
      chatSectionTitle.textContent = '聯絡專員';
    } else {
      chatSectionTitle.textContent = '留言板';
    }
  }

  // --- 報價/付款區塊邏輯（支援多筆報價單） ---
  // Mock 資料：模擬後端回傳的多筆報價單（含各種狀態）
  var mockQuotations = [
    {
      quotationNo: 'GC-20251204-0001-Q1',
      amount: '15,750',
      status: '待確認',        // pending
      paymentStatus: '',
      payMethod: '',
      payTime: '',
      invoiceNo: '',
      invoiceDate: '',
      invoiceAmount: '',
      invoiceType: '',
      invoiceCarrier: ''
    },
    {
      quotationNo: 'GC-20251204-0001-Q2',
      amount: '8,400',
      status: '待付款',        // confirmed
      paymentStatus: 'confirmed',
      sigImage: '',
      sigTime: '2025/12/06 14:20',
      payMethod: '',
      payTime: '',
      invoiceNo: '',
      invoiceDate: '',
      invoiceAmount: '',
      invoiceType: '',
      invoiceCarrier: ''
    },
    {
      quotationNo: 'GC-20251204-0001-Q3',
      amount: '22,000',
      status: '已付款',        // paid
      paymentStatus: 'paid',
      sigImage: '',
      sigTime: '2025/12/01 09:15',
      payMethod: '信用卡',
      payTime: '2025/12/10 14:32',
      invoiceNo: 'AB-12345678',
      invoiceDate: '2025/12/10',
      invoiceAmount: '22,000',
      invoiceType: '手機條碼載具',
      invoiceCarrier: '/ABC1234'
    },
    {
      quotationNo: 'GC-20251204-0001-Q4',
      amount: '5,000',
      status: '草稿',          // draft → 不顯示
      paymentStatus: '',
      payMethod: '',
      payTime: ''
    },
    {
      quotationNo: 'GC-20251204-0001-Q5',
      amount: '3,200',
      status: '已刪除',        // deleted → 不顯示
      paymentStatus: '',
      payMethod: '',
      payTime: ''
    }
  ];

  // 篩選：排除「草稿」和「已刪除」狀態的報價單
  var visibleQuotations = mockQuotations.filter(function (q) {
    return q.status !== '草稿' && q.status !== '已刪除';
  });

  var paymentInfoSection = document.getElementById('paymentInfoSection');
  var quotationListContainer = document.getElementById('quotationListContainer');
  var caseNoParam = urlParams.get('order') || urlParams.get('caseNo') || '';
  var orderNumberEl = document.getElementById('orderNumber');
  var orderNumberText = orderNumberEl ? String(orderNumberEl.textContent || '').trim() : '';
  var repairOrderNo = caseNoParam || orderNumberText || 'default';
  var detailAttachmentSection = document.getElementById('detailAttachmentSection');
  var detailAttachmentImageGrid = document.getElementById('detailAttachmentImageGrid');
  var detailAttachmentFileList = document.getElementById('detailAttachmentFileList');
  var detailImagePopup = document.getElementById('detailImagePopup');
  var detailImagePopupImg = document.getElementById('detailImagePopupImg');
  var btnCloseDetailImagePopup = document.getElementById('btnCloseDetailImagePopup');

  renderDetailAttachments();
  bindDetailImagePopupEvents();

  // 當有可顯示的報價單時，渲染區塊
  if (visibleQuotations.length > 0 && paymentInfoSection && quotationListContainer) {
    paymentInfoSection.style.display = 'block';
    renderQuotationList(visibleQuotations);
  }

  function renderDetailAttachments() {
    if (!detailAttachmentSection || !detailAttachmentImageGrid || !detailAttachmentFileList) return;

    var attachments = getDetailAttachmentsByOrder(repairOrderNo);
    if (!attachments.length) {
      detailAttachmentSection.style.display = 'none';
      return;
    }

    var imageItems = attachments.filter(function (item) {
      return isImageFile(item.type || '', item.name || '');
    });
    var fileItems = attachments.filter(function (item) {
      return !isImageFile(item.type || '', item.name || '');
    });

    detailAttachmentImageGrid.innerHTML = imageItems.map(function (item, index) {
      return buildDetailAttachmentImageHtml(item, index);
    }).join('');

    detailAttachmentFileList.innerHTML = fileItems.map(function (item) {
      return buildDetailAttachmentFileHtml(item);
    }).join('');

    detailAttachmentSection.style.display = 'flex';
  }

  function getDetailAttachmentsByOrder(orderNo) {
    var storageKey = 'crmRepairDetailAttachments_' + orderNo;
    var stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.warn('附件資料解析失敗', e);
      }
    }

    // 該單號預設示意資料（可被 localStorage 覆蓋）
    if (orderNo === '20250808-001') {
      return [
        { name: 'JPG1.jpg', type: 'image/jpeg', label: 'JPG1' },
        { name: 'JPG2.jpg', type: 'image/jpeg', label: 'JPG2' },
        { name: '123.pdf', type: 'application/pdf' }
      ];
    }

    return [];
  }

  function buildDetailAttachmentImageHtml(item, index) {
    var src = item.dataUrl || item.url || '';
    var label = escapeHtml(item.label || ('IMG' + String(index + 1)));
    var name = escapeHtml(item.name || ('image-' + (index + 1)));

    // 沒有實際圖片時，使用可點擊的 SVG 佔位圖，避免點擊無反應
    var previewSrc = src || createPlaceholderImageDataUrl(item.label || ('IMG' + String(index + 1)));
    var previewHtml = '<button class="detail-attachment-image-preview" data-action="openDetailImagePopup" data-src="' + escapeAttr(previewSrc) + '" aria-label="放大查看 ' + name + '"><img src="' + previewSrc + '" alt="' + name + '"></button>';

    return '<div class="detail-attachment-image-item">' +
      previewHtml +
      '<p class="detail-attachment-image-name">' + name + '</p>' +
    '</div>';
  }

  function buildDetailAttachmentFileHtml(item) {
    var name = escapeHtml(item.name || '附件檔案');
    var url = item.url || item.dataUrl || '';
    var actionHtml = url
      ? '<a class="detail-attachment-file-link" href="' + url + '" target="_blank" rel="noopener noreferrer">開啟</a>'
      : '<span class="detail-attachment-file-link">檔案</span>';

    return '<div class="detail-attachment-file-item">' +
      '<p class="detail-attachment-file-name">' + name + '</p>' +
      actionHtml +
    '</div>';
  }

  function bindDetailImagePopupEvents() {
    if (detailAttachmentImageGrid) {
      detailAttachmentImageGrid.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-action="openDetailImagePopup"]');
        if (!trigger) return;

        var src = trigger.getAttribute('data-src') || '';
        openDetailImagePopup(src);
      });
    }

    if (detailImagePopup) {
      detailImagePopup.addEventListener('click', function (e) {
        var shouldClose = e.target.closest('[data-action="closeDetailImagePopup"]');
        if (shouldClose) {
          closeDetailImagePopup();
        }
      });
    }

    if (btnCloseDetailImagePopup) {
      btnCloseDetailImagePopup.addEventListener('click', closeDetailImagePopup);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && detailImagePopup && detailImagePopup.classList.contains('active')) {
        closeDetailImagePopup();
      }
    });
  }

  function openDetailImagePopup(src) {
    if (!detailImagePopup || !detailImagePopupImg || !src) return;

    detailImagePopupImg.src = src;
    detailImagePopup.classList.add('active');
    detailImagePopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailImagePopup() {
    if (!detailImagePopup || !detailImagePopupImg) return;

    detailImagePopup.classList.remove('active');
    detailImagePopup.setAttribute('aria-hidden', 'true');
    detailImagePopupImg.src = '';
    document.body.style.overflow = '';
  }

  function createPlaceholderImageDataUrl(labelText) {
    var text = String(labelText || 'IMAGE').replace(/[<>]/g, '');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">' +
      '<rect width="640" height="640" fill="#f4f1ec"/>' +
      '<rect x="30" y="30" width="580" height="580" rx="24" fill="#fbfaf7" stroke="#c8bba9" stroke-width="4"/>' +
      '<text x="320" y="336" text-anchor="middle" fill="#8f867a" font-size="76" font-family="Arial, sans-serif" font-weight="700">' + text + '</text>' +
    '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  /**
   * 渲染多筆報價單卡片
   */
  function renderQuotationList(quotations) {
    var html = '';
    quotations.forEach(function (q, index) {
      html += buildQuotationCard(q, index);
    });
    quotationListContainer.innerHTML = html;
    bindQuotationEvents();
  }

  /**
   * 根據報價單狀態產生對應 HTML 卡片
   */
  function buildQuotationCard(q, index) {
    var cardHtml = '<div class="payment-status-block" data-quotation-index="' + index + '">';

    if (q.status === '待確認') {
      // 待確認報價
      cardHtml += '<div class="payment-info-header">' +
        '<span class="payment-info-icon">💰</span>' +
        '<span class="payment-info-title">報價單資訊</span>' +
      '</div>';
      cardHtml += '<div class="payment-detail-rows">' +
        '<p class="detail-row"><span class="detail-label">報價單號</span>｜<span>' + q.quotationNo + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">報價金額</span>｜<span class="text-bold">NT$ ' + q.amount + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">付款狀態</span>｜<span class="pay-status-badge">待確認</span></p>' +
      '</div>';
      cardHtml += '<a class="btn-view-quotation" href="#" data-action="viewQuotation" data-no="' + q.quotationNo + '" data-amount="' + q.amount + '">' +
        '<span class="quotation-link-icon">📋</span>' +
        '<span class="quotation-link-text">查看報價單內容</span>' +
        '<span class="quotation-link-arrow">›</span>' +
      '</a>';
      cardHtml += '<button class="btn-payment-action" data-action="confirmQuotation" data-no="' + q.quotationNo + '" data-amount="' + q.amount + '">確認報價並簽名</button>';

    } else if (q.status === '待付款') {
      // 待付款（已確認，可付款）
      cardHtml += '<div class="payment-info-header">' +
        '<span class="payment-info-icon">💳</span>' +
        '<span class="payment-info-title">付款資訊</span>' +
      '</div>';
      cardHtml += '<div class="payment-detail-rows">' +
        '<p class="detail-row"><span class="detail-label">報價單號</span>｜<span>' + q.quotationNo + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">應付金額</span>｜<span class="text-bold text-gold">NT$ ' + q.amount + '</span></p>' +
      '</div>';
      cardHtml += '<a class="btn-view-quotation" href="#" data-action="viewQuotation" data-no="' + q.quotationNo + '" data-amount="' + q.amount + '">' +
        '<span class="quotation-link-icon">📋</span>' +
        '<span class="quotation-link-text">查看報價單內容</span>' +
        '<span class="quotation-link-arrow">›</span>' +
      '</a>';
      // 簽名紀錄
      cardHtml += buildSignatureRecord(q, 'confirmed-' + index);
      cardHtml += '<button class="btn-payment-action btn-go-pay" data-action="goPay" data-no="' + q.quotationNo + '" data-amount="' + q.amount + '">前往付款</button>';

    } else if (q.status === '已付款') {
      // 已付款
      cardHtml += '<div class="payment-info-header">' +
        '<span class="payment-info-icon">✅</span>' +
        '<span class="payment-info-title">付款完成</span>' +
      '</div>';
      cardHtml += '<div class="payment-detail-rows">' +
        '<p class="detail-row"><span class="detail-label">報價單號</span>｜<span>' + q.quotationNo + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">付款金額</span>｜<span class="text-bold">NT$ ' + q.amount + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">付款方式</span>｜<span>' + (q.payMethod || '-') + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">付款時間</span>｜<span>' + (q.payTime || '-') + '</span></p>' +
      '</div>';
      cardHtml += '<a class="btn-view-quotation" href="#" data-action="viewQuotation" data-no="' + q.quotationNo + '" data-amount="' + q.amount + '">' +
        '<span class="quotation-link-icon">📋</span>' +
        '<span class="quotation-link-text">查看報價單內容</span>' +
        '<span class="quotation-link-arrow">›</span>' +
      '</a>';
      // 簽名紀錄
      cardHtml += buildSignatureRecord(q, 'paid-' + index);
      // 發票資訊
      if (q.invoiceNo) {
        cardHtml += buildInvoiceBlock(q);
      }
      cardHtml += '<div class="payment-complete-badge"><span>已完成付款</span></div>';
    }

    cardHtml += '</div>';
    // 多筆之間加間距分隔
    cardHtml += '<div class="quotation-card-spacer"></div>';
    return cardHtml;
  }

  /**
   * 產生簽名紀錄 HTML
   */
  function buildSignatureRecord(q, suffix) {
    var sigImage = q.sigImage || '';
    var sigTime = q.sigTime || '';
    return '<div class="signature-record" id="sigRecord-' + suffix + '">' +
      '<div class="sig-record-header">' +
        '<span class="sig-record-icon">✍️</span>' +
        '<span class="sig-record-title">報價確認簽名</span>' +
      '</div>' +
      '<div class="sig-record-body">' +
        '<img class="sig-record-image" id="sigImage-' + suffix + '" src="' + sigImage + '" alt="客戶簽名">' +
        '<p class="sig-record-time" id="sigTime-' + suffix + '">簽名時間：' + sigTime + '</p>' +
      '</div>' +
    '</div>';
  }

  /**
   * 產生發票資訊區塊 HTML
   */
  function buildInvoiceBlock(q) {
    var carrierRow = '';
    if (q.invoiceType === '手機條碼載具' && q.invoiceCarrier) {
      carrierRow = '<p class="detail-row"><span class="detail-label">載具編號</span>｜<span>' + q.invoiceCarrier + '</span></p>';
    }
    return '<div class="invoice-info-block">' +
      '<div class="invoice-info-header">' +
        '<span class="invoice-info-icon">🧾</span>' +
        '<span class="invoice-info-title">發票資訊</span>' +
      '</div>' +
      '<div class="invoice-detail-rows">' +
        '<p class="detail-row"><span class="detail-label">發票號碼</span>｜<span>' + q.invoiceNo + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">開立日期</span>｜<span>' + q.invoiceDate + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">發票金額</span>｜<span class="text-bold">NT$ ' + q.invoiceAmount + '</span></p>' +
        '<p class="detail-row"><span class="detail-label">開立方式</span>｜<span>' + q.invoiceType + '</span></p>' +
        carrierRow +
      '</div>' +
      '<div class="invoice-status-badge"><span>已開立</span></div>' +
    '</div>';
  }

  /**
   * 綁定報價單卡片上的事件
   */
  function bindQuotationEvents() {
    // 查看報價單連結
    quotationListContainer.querySelectorAll('[data-action="viewQuotation"]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var no = el.getAttribute('data-no');
        var amount = el.getAttribute('data-amount');
        var url = 'crm-repair-quotation-detail.html?quotationNo=' + encodeURIComponent(no) +
          '&amount=' + encodeURIComponent(amount) +
          '&order=' + encodeURIComponent(caseNoParam);
        window.location.href = url;
      });
    });

    // 確認報價並簽名按鈕
    quotationListContainer.querySelectorAll('[data-action="confirmQuotation"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var no = el.getAttribute('data-no');
        var amount = el.getAttribute('data-amount');
        openConfirmModal(no, amount);
      });
    });

    // 前往付款按鈕
    quotationListContainer.querySelectorAll('[data-action="goPay"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var no = el.getAttribute('data-no');
        var amount = el.getAttribute('data-amount');
        var payUrl = 'crm-repair-payment.html?caseNo=' + encodeURIComponent(caseNoParam) +
          '&quotationNo=' + encodeURIComponent(no) +
          '&amount=' + encodeURIComponent(amount);
        window.location.href = payUrl;
      });
    });
  }

  // --- 載入已存在的簽名紀錄（Mock 資料填入） ---
  function loadSavedSignatures() {
    visibleQuotations.forEach(function (q, index) {
      if (q.status === '待付款' || q.status === '已付款') {
        var suffix = (q.status === '待付款') ? 'confirmed-' + index : 'paid-' + index;
        var saved = localStorage.getItem('quotationSig_' + q.quotationNo);
        if (!saved && q.sigTime) {
          // 產生 Mock 簽名圖
          var mockCanvas = document.createElement('canvas');
          mockCanvas.width = 360;
          mockCanvas.height = 100;
          var mockCtx = mockCanvas.getContext('2d');
          mockCtx.fillStyle = '#fafafa';
          mockCtx.fillRect(0, 0, 360, 100);
          mockCtx.fillStyle = '#999';
          mockCtx.font = '14px "Noto Sans TC", sans-serif';
          mockCtx.textAlign = 'center';
          mockCtx.fillText('王大明（已簽名）', 180, 55);
          saved = JSON.stringify({ image: mockCanvas.toDataURL('image/png'), time: q.sigTime });
        }
        if (saved) {
          try {
            var sigData = JSON.parse(saved);
            var imgEl = document.getElementById('sigImage-' + suffix);
            var timeEl = document.getElementById('sigTime-' + suffix);
            if (imgEl) { imgEl.src = sigData.image; imgEl.style.display = 'block'; }
            if (timeEl) { timeEl.textContent = '簽名時間：' + sigData.time; }
          } catch (e) { /* ignore */ }
        }
      }
    });
  }
  loadSavedSignatures();

  // --- 共用簽名確認彈窗邏輯 ---
  var quotationOverlay = document.getElementById('quotationConfirmOverlay');
  var btnCloseQuotationModal = document.getElementById('btnCloseQuotationModal');
  var btnCancelQuotation = document.getElementById('btnCancelQuotation');
  var btnSubmitQuotation = document.getElementById('btnSubmitQuotation');
  var quotationSigCanvas = document.getElementById('quotationSignatureCanvas');
  var quotationSigPlaceholder = document.getElementById('quotationSigPlaceholder');
  var btnClearQuotationSig = document.getElementById('btnClearQuotationSig');
  var confirmQNoEl = document.getElementById('confirmQuotationNo');
  var confirmAmountEl = document.getElementById('confirmAmount');

  var sigCtx = quotationSigCanvas ? quotationSigCanvas.getContext('2d') : null;
  var isDrawing = false;
  var hasSigned = false;
  var activeQuotationNo = ''; // 目前開啟彈窗對應的報價單號
  var activeQuotationAmount = '';

  function resizeQuotationCanvas() {
    if (!quotationSigCanvas) return;
    var wrap = document.getElementById('quotationSignatureWrap');
    var rect = wrap.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    quotationSigCanvas.width = rect.width * dpr;
    quotationSigCanvas.height = 160 * dpr;
    quotationSigCanvas.style.width = rect.width + 'px';
    quotationSigCanvas.style.height = '160px';
    sigCtx.scale(dpr, dpr);
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.lineWidth = 2;
    sigCtx.strokeStyle = '#333';
  }

  function getCanvasPos(e) {
    var rect = quotationSigCanvas.getBoundingClientRect();
    var touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    hasSigned = true;
    if (quotationSigPlaceholder) quotationSigPlaceholder.classList.add('hidden');
    if (btnSubmitQuotation) btnSubmitQuotation.disabled = false;
    var pos = getCanvasPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    var pos = getCanvasPos(e);
    sigCtx.lineTo(pos.x, pos.y);
    sigCtx.stroke();
  }

  function endDraw() {
    isDrawing = false;
  }

  if (quotationSigCanvas) {
    quotationSigCanvas.addEventListener('mousedown', startDraw);
    quotationSigCanvas.addEventListener('mousemove', draw);
    quotationSigCanvas.addEventListener('mouseup', endDraw);
    quotationSigCanvas.addEventListener('mouseleave', endDraw);
    quotationSigCanvas.addEventListener('touchstart', startDraw, { passive: false });
    quotationSigCanvas.addEventListener('touchmove', draw, { passive: false });
    quotationSigCanvas.addEventListener('touchend', endDraw);
  }

  // 清除簽名
  if (btnClearQuotationSig) {
    btnClearQuotationSig.addEventListener('click', function () {
      if (sigCtx && quotationSigCanvas) {
        sigCtx.clearRect(0, 0, quotationSigCanvas.width, quotationSigCanvas.height);
        hasSigned = false;
        if (quotationSigPlaceholder) quotationSigPlaceholder.classList.remove('hidden');
        if (btnSubmitQuotation) btnSubmitQuotation.disabled = true;
      }
    });
  }

  // 開啟確認彈窗（由多筆報價單按鈕觸發）
  function openConfirmModal(quotationNo, amount) {
    activeQuotationNo = quotationNo;
    activeQuotationAmount = amount;
    if (confirmQNoEl) confirmQNoEl.textContent = quotationNo;
    if (confirmAmountEl) confirmAmountEl.textContent = 'NT$ ' + amount;
    // 清除先前簽名
    if (sigCtx && quotationSigCanvas) {
      sigCtx.clearRect(0, 0, quotationSigCanvas.width, quotationSigCanvas.height);
    }
    hasSigned = false;
    if (quotationSigPlaceholder) quotationSigPlaceholder.classList.remove('hidden');
    if (btnSubmitQuotation) btnSubmitQuotation.disabled = true;
    if (quotationOverlay) quotationOverlay.classList.add('active');
    setTimeout(resizeQuotationCanvas, 50);
  }

  // 關閉確認彈窗
  function closeQuotationModal() {
    if (quotationOverlay) quotationOverlay.classList.remove('active');
  }
  if (btnCloseQuotationModal) btnCloseQuotationModal.addEventListener('click', closeQuotationModal);
  if (btnCancelQuotation) btnCancelQuotation.addEventListener('click', closeQuotationModal);

  // 確認送出（含簽名）
  if (btnSubmitQuotation) {
    btnSubmitQuotation.addEventListener('click', function () {
      if (!hasSigned) return;
      var signatureDataUrl = quotationSigCanvas.toDataURL('image/png');
      // 記錄簽名時間
      var now = new Date();
      var sigTimeStr = now.getFullYear() + '/' +
        String(now.getMonth() + 1).padStart(2, '0') + '/' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

      // 儲存簽名至 localStorage（模擬 API 儲存）
      var sigData = { image: signatureDataUrl, time: sigTimeStr };
      localStorage.setItem('quotationSig_' + activeQuotationNo, JSON.stringify(sigData));

      // 更新 Mock 資料中該筆報價單狀態為「待付款」
      visibleQuotations.forEach(function (q) {
        if (q.quotationNo === activeQuotationNo) {
          q.status = '待付款';
          q.paymentStatus = 'confirmed';
          q.sigTime = sigTimeStr;
          q.sigImage = signatureDataUrl;
        }
      });

      // 重新渲染報價單列表
      renderQuotationList(visibleQuotations);
      loadSavedSignatures();

      closeQuotationModal();
      // TODO: 呼叫 API 送出報價確認 + 簽名圖
      console.log('客戶確認報價並簽名', { quotationNo: activeQuotationNo, signatureTime: sigTimeStr });
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

  // --- 簽名功能（使用共用元件） ---
  SignaturePadComponent.init({
    mountId: 'signatureMount',
    mode: 'overlay',
    storageKey: 'crmRepairSignature'
  });

  // --- 滿意度問卷按鈕 ---
  var btnSurvey = document.getElementById('btnSurvey');
  if (btnSurvey) {
    btnSurvey.addEventListener('click', function () {
      var urlParams = new URLSearchParams(window.location.search);
      var caseNo = urlParams.get('no') || urlParams.get('caseId') || '';
      window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(caseNo) + '&type=' + encodeURIComponent('修繕');
    });
  }

  // --- 下載附件按鈕 ---
  document.querySelectorAll('[data-action="download"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fileName = btn.getAttribute('data-file');
      console.log('下載附件：' + fileName);
    });
  });

  // --- 我要留言功能 ---
  var btnLeaveMessage = document.getElementById('btnLeaveMessage');
  var messageModalOverlay = document.getElementById('messageModalOverlay');
  var messageTextarea = document.getElementById('messageTextarea');
  var messageFileInput = document.getElementById('messageFileInput');
  var selectedFileEl = document.getElementById('selectedFile');
  var selectedFileName = document.getElementById('selectedFileName');
  var btnRemoveFile = document.getElementById('btnRemoveFile');
  var btnMsgCancel = document.getElementById('btnMsgCancel');
  var btnMsgSend = document.getElementById('btnMsgSend');
  var chatMessages = document.getElementById('chatMessages');
  var chatArea = document.querySelector('.chat-area');
  var attachedFile = null;
  var userMessageStorageKey = 'crmRepairUserMessages_' + repairOrderNo;

  // 載入同一單號下，使用者先前送出的訊息與附件
  loadSavedUserMessages();

  // 開啟留言彈窗
  if (btnLeaveMessage) {
    btnLeaveMessage.addEventListener('click', function () {
      if (messageModalOverlay) {
        messageModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // 關閉留言彈窗（重置表單）
  function closeMessageModal() {
    if (messageModalOverlay) {
      messageModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (messageTextarea) messageTextarea.value = '';
    if (messageFileInput) messageFileInput.value = '';
    if (selectedFileEl) selectedFileEl.style.display = 'none';
    attachedFile = null;
  }

  // 取消按鈕
  if (btnMsgCancel) {
    btnMsgCancel.addEventListener('click', closeMessageModal);
  }

  // 點擊遮罩外部關閉
  if (messageModalOverlay) {
    messageModalOverlay.addEventListener('click', function (e) {
      if (e.target === messageModalOverlay) {
        closeMessageModal();
      }
    });
  }

  // 選擇檔案
  if (messageFileInput) {
    messageFileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        var file = this.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('檔案大小不可超過 5MB');
          this.value = '';
          return;
        }
        attachedFile = file;
        if (selectedFileName) selectedFileName.textContent = file.name;
        if (selectedFileEl) selectedFileEl.style.display = 'flex';
      }
    });
  }

  // 移除已選檔案
  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', function () {
      attachedFile = null;
      if (messageFileInput) messageFileInput.value = '';
      if (selectedFileEl) selectedFileEl.style.display = 'none';
    });
  }

  // 發送訊息
  if (btnMsgSend) {
    btnMsgSend.addEventListener('click', function () {
      var msgText = messageTextarea ? messageTextarea.value.trim() : '';
      if (!msgText && !attachedFile) {
        alert('請輸入訊息或選擇附件');
        return;
      }

      // 產生時間戳
      var now = new Date();
      var y = now.getFullYear();
      var m = String(now.getMonth() + 1).padStart(2, '0');
      var d = String(now.getDate()).padStart(2, '0');
      var hh = now.getHours();
      var mm = String(now.getMinutes()).padStart(2, '0');
      var ampm = hh >= 12 ? 'PM' : 'AM';
      var h12 = hh % 12 || 12;
      var timeStr = y + '/' + m + '/' + d + ' ' + h12 + ':' + mm + ' ' + ampm;

      // 有附件時先轉成 Data URL，再儲存與渲染，確保重整後仍可顯示
      if (attachedFile) {
        readFileAsDataUrl(attachedFile, function (dataUrl) {
          appendUserMessage(msgText, timeStr, {
            name: attachedFile.name,
            type: attachedFile.type || '',
            dataUrl: dataUrl
          });
        });
      } else {
        appendUserMessage(msgText, timeStr, null);
      }

      closeMessageModal();
    });
  }

  function loadSavedUserMessages() {
    if (!chatMessages) return;
    var saved = localStorage.getItem(userMessageStorageKey);
    if (!saved) return;

    try {
      var messages = JSON.parse(saved);
      if (!Array.isArray(messages)) return;

      messages.forEach(function (msg) {
        chatMessages.insertAdjacentHTML('beforeend', buildUserMessageHtml(msg.text || '', msg.time || '', msg.file || null));
      });

      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    } catch (e) {
      console.warn('載入使用者留言失敗', e);
    }
  }

  function appendUserMessage(text, timeStr, fileData) {
    if (!chatMessages) return;

    chatMessages.insertAdjacentHTML('beforeend', buildUserMessageHtml(text, timeStr, fileData));
    saveUserMessage({ text: text, time: timeStr, file: fileData });

    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }

  function buildUserMessageHtml(text, timeStr, fileData) {
    var msgHtml = '<div class="chat-msg-user">';
    if (text) {
      msgHtml += '<div class="msg-bubble">' + escapeHtml(text) + '</div>';
    }
    if (fileData) {
      msgHtml += buildAttachmentHtml(fileData);
    }
    msgHtml += '<p class="msg-time">' + escapeHtml(timeStr) + '</p>';
    msgHtml += '</div>';
    return msgHtml;
  }

  function saveUserMessage(message) {
    try {
      var raw = localStorage.getItem(userMessageStorageKey);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      list.push(message);
      localStorage.setItem(userMessageStorageKey, JSON.stringify(list));
    } catch (e) {
      console.warn('儲存使用者留言失敗', e);
    }
  }

  function readFileAsDataUrl(file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      callback(event.target.result || '');
    };
    reader.onerror = function () {
      callback('');
    };
    reader.readAsDataURL(file);
  }

  // HTML 跳脫防止 XSS
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 產生附件預覽 HTML（圖片/影片直接顯示）
  function buildAttachmentHtml(file) {
    var name = file && file.name ? file.name : '';
    var type = file && file.type ? file.type : '';
    var sourceUrl = file && file.dataUrl ? file.dataUrl : URL.createObjectURL(file);
    var safeName = escapeHtml(name);

    if (isImageFile(type, name)) {
      return '<div class="attachment-item attachment-item-preview">' +
        '<img class="attachment-preview-image" src="' + sourceUrl + '" alt="' + safeName + '">' +
        '<p class="file-name">' + safeName + '</p>' +
      '</div>';
    }

    if (isVideoFile(type, name)) {
      return '<div class="attachment-item attachment-item-preview">' +
        '<video class="attachment-preview-video" controls preload="metadata" playsinline>' +
          '<source src="' + sourceUrl + '" type="' + escapeHtml(type || 'video/mp4') + '">' +
          '您的瀏覽器不支援影片播放。' +
        '</video>' +
        '<p class="file-name">' + safeName + '</p>' +
      '</div>';
    }

    // 其他檔案類型維持下載按鈕呈現
    return '<div class="attachment-item">' +
      '<p class="file-name">' + safeName + '</p>' +
      '<button class="download-btn" data-action="download" data-file="' + safeName + '">' +
        '<img src="assets/download-btn.svg" alt="下載">' +
      '</button>' +
    '</div>';
  }

  function isImageFile(type, name) {
    var normalizedType = (type || '').toLowerCase();
    return normalizedType.indexOf('image/') === 0 || /\.(jpg|jpeg|png|gif|webp)$/i.test(name || '');
  }

  function isVideoFile(type, name) {
    var normalizedType = (type || '').toLowerCase();
    return normalizedType.indexOf('video/') === 0 || /\.(mp4|mov|webm)$/i.test(name || '');
  }

});
