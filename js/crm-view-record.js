/* ============================================
   檢視紀錄頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:6289)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 返回按鈕 ---
  var btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-custom-service.html';
      }
    });
  }

  // --- 首頁按鈕 ---
  var btnHome = document.getElementById('btnHome');
  if (btnHome) {
    btnHome.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'crm-index_life.html';
    });
  }

  // --- 簽名功能（使用共用元件） ---
  SignaturePadComponent.init({
    mountId: 'signatureMount',
    mode: 'overlay',
    storageKey: 'crmSignature',
    showInlineButtons: false
  });

  // --- 從 URL 參數讀取狀態，預設為「預約中」 ---
  var urlParams = new URLSearchParams(window.location.search);
  var currentStatus = urlParams.get('status') || '預約中';

  // --- 根據狀態設置 Badge 樣式 ---
  var statusBadge = document.getElementById('statusBadge');
  if (statusBadge) {
    if (currentStatus === '已完成') {
      statusBadge.classList.add('status-done');
      statusBadge.querySelector('span').textContent = '已完成';
    } else if (currentStatus === '預約中') {
      statusBadge.classList.add('status-processing');
      statusBadge.querySelector('span').textContent = '預約中';
    }
  }

  // --- 根據狀態控制簽名區塊與費用通知顯示 ---
  var signatureSection = document.getElementById('signatureMount');
  var feeNotice = document.getElementById('feeNotice');
  if (currentStatus !== '已完成') {
    // 預約中：隱藏簽名區塊與費用通知
    if (signatureSection) signatureSection.style.display = 'none';
    if (feeNotice) feeNotice.style.display = 'none';
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
  var chatMessages = document.querySelector('.chat-messages');
  var chatArea = document.querySelector('.chat-area');
  var attachedFile = null;

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
        // 檢查檔案大小（5MB）
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

      // 建立訊息 HTML
      var msgHtml = '<div class="chat-msg-user">';
      if (msgText) {
        msgHtml += '<div class="msg-bubble">' + escapeHtml(msgText) + '</div>';
      }
      if (attachedFile) {
        msgHtml += buildAttachmentHtml(attachedFile);
      }
      msgHtml += '<p class="msg-time">' + timeStr + '</p>';
      msgHtml += '</div>';

      // 插入新訊息到聊天區
      if (chatMessages) {
        chatMessages.insertAdjacentHTML('beforeend', msgHtml);
      }

      // 捲動至底部
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }

      // 關閉彈窗
      closeMessageModal();
    });
  }

  // HTML 跳脫防止 XSS
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // 產生附件預覽 HTML（圖片/影片直接顯示）
  function buildAttachmentHtml(file) {
    var objectUrl = URL.createObjectURL(file);
    var safeName = escapeHtml(file.name);

    if (isImageFile(file)) {
      return '<div class="attachment-item attachment-item-preview">' +
        '<img class="attachment-preview-image" src="' + objectUrl + '" alt="' + safeName + '">' +
        '<p class="file-name">' + safeName + '</p>' +
      '</div>';
    }

    if (isVideoFile(file)) {
      return '<div class="attachment-item attachment-item-preview">' +
        '<video class="attachment-preview-video" controls preload="metadata" playsinline>' +
          '<source src="' + objectUrl + '" type="' + escapeHtml(file.type || 'video/mp4') + '">' +
          '您的瀏覽器不支援影片播放。' +
        '</video>' +
        '<p class="file-name">' + safeName + '</p>' +
      '</div>';
    }

    return '<div class="attachment-item">' +
      '<p class="file-name">' + safeName + '</p>' +
      '<button class="download-btn" data-action="download" data-file="' + safeName + '">' +
        '<img src="assets/download-btn.svg" alt="下載">' +
      '</button>' +
    '</div>';
  }

  function isImageFile(file) {
    var type = (file.type || '').toLowerCase();
    return type.indexOf('image/') === 0 || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '');
  }

  function isVideoFile(file) {
    var type = (file.type || '').toLowerCase();
    return type.indexOf('video/') === 0 || /\.(mp4|mov|webm)$/i.test(file.name || '');
  }

});
