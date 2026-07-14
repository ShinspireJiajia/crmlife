/* ============================================
   綠海養護 - 檢視紀錄頁面互動邏輯
   支援兩種狀態：已完成 (completed) / 預約中 (pending)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 取得 URL 參數判斷狀態 ---
  var urlParams = new URLSearchParams(window.location.search);
  var status = urlParams.get('status') || 'completed';

  // --- DOM 元素 ---
  var statusBadge = document.getElementById('statusBadge');
  var completedOnlyElements = document.querySelectorAll('.completed-only');
  var btnLeaveMessage = document.getElementById('btnLeaveMessage');
  var messageModalOverlay = document.getElementById('messageModalOverlay');
  var btnMsgCancel = document.getElementById('btnMsgCancel');
  var btnMsgSend = document.getElementById('btnMsgSend');
  var messageTextarea = document.getElementById('messageTextarea');
  var messageFileInput = document.getElementById('messageFileInput');
  var selectedFile = document.getElementById('selectedFile');
  var selectedFileName = document.getElementById('selectedFileName');
  var btnRemoveFile = document.getElementById('btnRemoveFile');
  var btnSurvey = document.getElementById('btnSurvey');

  // --- 簽名功能相關 ---
  var signatureCanvas = document.getElementById('signatureCanvas');
  var signaturePlaceholder = document.getElementById('signaturePlaceholder');
  var btnClearSignature = document.getElementById('btnClearSignature');
  var btnConfirmSignature = document.getElementById('btnConfirmSignature');
  var signatureCanvasWrap = document.getElementById('signatureCanvasWrap');
  var ctx = null;
  var isDrawing = false;
  var hasSignature = false;

  // --- 根據狀態切換顯示 ---
  if (status === 'pending') {
    // 預約中：隱藏完成通知、完工資訊、簽名、滿意度問卷
    statusBadge.classList.add('status-pending');
    statusBadge.classList.remove('status-completed');
    statusBadge.querySelector('span').textContent = '預約中';

    completedOnlyElements.forEach(function (el) {
      el.style.display = 'none';
    });
  } else {
    // 已完成：顯示所有區塊
    statusBadge.classList.add('status-completed');
    statusBadge.classList.remove('status-pending');
    statusBadge.querySelector('span').textContent = '已完成';

    // 初始化簽名板
    initSignaturePad();
  }

  // --- 簽名板初始化 ---
  function initSignaturePad() {
    if (!signatureCanvas) return;

    // 設定 canvas 尺寸
    function resizeCanvas() {
      var wrap = signatureCanvasWrap;
      signatureCanvas.width = wrap.clientWidth;
      signatureCanvas.height = wrap.clientHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx = signatureCanvas.getContext('2d');
    ctx.strokeStyle = '#3a4246';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 滑鼠事件
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseleave', stopDrawing);

    // 觸控事件
    signatureCanvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      startDrawing({ clientX: touch.clientX, clientY: touch.clientY, target: signatureCanvas });
    });
    signatureCanvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var touch = e.touches[0];
      draw({ clientX: touch.clientX, clientY: touch.clientY });
    });
    signatureCanvas.addEventListener('touchend', stopDrawing);
  }

  function startDrawing(e) {
    isDrawing = true;
    hasSignature = true;
    if (signaturePlaceholder) {
      signaturePlaceholder.classList.add('hidden');
    }
    var rect = signatureCanvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function draw(e) {
    if (!isDrawing) return;
    var rect = signatureCanvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // --- 清除簽名 ---
  if (btnClearSignature) {
    btnClearSignature.addEventListener('click', function () {
      if (ctx && signatureCanvas) {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        hasSignature = false;
        if (signaturePlaceholder) {
          signaturePlaceholder.classList.remove('hidden');
        }
      }
    });
  }

  // --- 確認簽名 ---
  if (btnConfirmSignature) {
    btnConfirmSignature.addEventListener('click', function () {
      if (!hasSignature) {
        alert('請先完成簽名');
        return;
      }
      alert('簽名已確認，感謝您！');
    });
  }

  // --- 滿意度問卷按鈕 ---
  if (btnSurvey) {
    btnSurvey.addEventListener('click', function () {
      var caseNo = urlParams.get('no') || urlParams.get('caseId') || '';
      window.location.href = 'crm-satisfaction-survey.html?no=' + encodeURIComponent(caseNo) + '&type=' + encodeURIComponent('綠海養護');
    });
  }

  // --- 下載附件 ---
  document.addEventListener('click', function (e) {
    var downloadBtn = e.target.closest('[data-action="download"]');
    if (downloadBtn) {
      var fileName = downloadBtn.getAttribute('data-file');
      alert('即將下載：' + fileName);
    }
  });

  // --- 我要留言彈窗 ---
  if (btnLeaveMessage) {
    btnLeaveMessage.addEventListener('click', function () {
      messageModalOverlay.classList.add('active');
    });
  }

  if (btnMsgCancel) {
    btnMsgCancel.addEventListener('click', function () {
      messageModalOverlay.classList.remove('active');
      resetMessageModal();
    });
  }

  // 點擊遮罩關閉彈窗
  if (messageModalOverlay) {
    messageModalOverlay.addEventListener('click', function (e) {
      if (e.target === messageModalOverlay) {
        messageModalOverlay.classList.remove('active');
        resetMessageModal();
      }
    });
  }

  // --- 選擇檔案 ---
  if (messageFileInput) {
    messageFileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        var file = this.files[0];
        // 檢查檔案大小（最大 5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('檔案大小不可超過 5MB');
          this.value = '';
          return;
        }
        selectedFileName.textContent = file.name;
        selectedFile.style.display = 'flex';
      }
    });
  }

  // --- 移除已選檔案 ---
  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', function () {
      messageFileInput.value = '';
      selectedFile.style.display = 'none';
      selectedFileName.textContent = '';
    });
  }

  // --- 發送訊息 ---
  if (btnMsgSend) {
    btnMsgSend.addEventListener('click', function () {
      var msgText = messageTextarea.value.trim();
      var hasFile = messageFileInput.files && messageFileInput.files.length > 0;

      if (!msgText && !hasFile) {
        alert('請輸入訊息或選擇檔案');
        return;
      }

      // 新增訊息至聊天區
      var chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        var now = new Date();
        var timeStr = now.getFullYear() + '/' +
          String(now.getMonth() + 1).padStart(2, '0') + '/' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0');

        var msgHtml = '<div class="chat-msg-user">';
        if (msgText) {
          msgHtml += '<div class="msg-bubble">' + escapeHtml(msgText) + '</div>';
        }
        msgHtml += '<p class="msg-time">' + timeStr + '</p>';
        msgHtml += '</div>';

        chatMessages.insertAdjacentHTML('beforeend', msgHtml);

        // 滾動到最底
        var chatArea = document.querySelector('.chat-area');
        if (chatArea) {
          chatArea.scrollTop = chatArea.scrollHeight;
        }
      }

      messageModalOverlay.classList.remove('active');
      resetMessageModal();
    });
  }

  // --- 重置留言彈窗 ---
  function resetMessageModal() {
    if (messageTextarea) messageTextarea.value = '';
    if (messageFileInput) messageFileInput.value = '';
    if (selectedFile) selectedFile.style.display = 'none';
    if (selectedFileName) selectedFileName.textContent = '';
  }

  // --- HTML 跳脫工具函式 ---
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

});
