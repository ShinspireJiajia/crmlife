/* ============================================
   生活服務預約詳情頁邏輯
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     預約表單狀態規則定義
     ------------------------------------------
     狀態           說明                    可執行操作
     ─────────────────────────────────────────────
     待確認         使用者送出預約後初始狀態  可取消、可留言
     已確認         管理員 / 廠商確認預約     不可取消（僅後台可取消）、可留言
     已完成         服務完成（終態）          僅可留言，顯示完成資訊
     已取消         預約被取消（終態）        僅可查看，不可留言
     已取消服務     後台取消已確認預約（終態）僅可查看，不可留言

     狀態流轉：
       待確認 → 已確認（廠商確認）
       待確認 → 已取消（使用者取消）
       已確認 → 已完成（服務完成）
       已確認 → 已取消服務（後台取消）
       已完成 → （終態，不可變更）
       已取消 → （終態，不可變更）
       已取消服務 → （終態，不可變更）
     ------------------------------------------ */
  var STATUS_RULES = {
    '待確認': { canCancel: true,  canMessage: true,  showCompletion: false },
    '已確認': { canCancel: false, canMessage: true,  showCompletion: false },
    '已完成': { canCancel: false, canMessage: true,  showCompletion: true  },
    '已取消': { canCancel: false, canMessage: false, showCompletion: false },
    '已取消服務': { canCancel: false, canMessage: false, showCompletion: false }
  };

  /* ------------------------------------------
     Mock 預約紀錄資料
     ------------------------------------------ */
  var bookingData = {
    'LS20260421-004': {
      orderId: 'LS20260421-004',
      status: '待確認',
      statusClass: 'status-pending',
      serviceName: '靜心瑜伽工作室',
      serviceItem: '十堂課程包',
      price: '$4,500',
      date: '2026/04/25',
      contactPeriod: '下午',
      unit: 'A3-3',
      name: '王小明',
      phone: '0912-345-678',
      note: '希望安排平日晚上 7 點的時段。',
      completedDate: '',
      completedNote: '',
      messages: []
    },
    'LS20260415-001': {
      orderId: 'LS20260415-001',
      status: '已確認',
      statusClass: 'status-confirmed',
      serviceName: 'HoHo 居家打掃',
      serviceItem: '專業清潔服務 4HRS',
      price: '$3,800',
      date: '2026/04/20',
      contactPeriod: '下午',
      unit: 'A3-3',
      name: '王小明',
      phone: '0912-345-678',
      note: '有養寵物，請攜帶寵物友善清潔用品。',
      completedDate: '',
      completedNote: '',
      messages: [
        { type: 'user', text: '請問清潔人員大約幾點會到？', time: '2026/04/19 10:30 AM' },
        { type: 'agent', text: '您好，預計下午 1:30 抵達，届時會提前電話通知您。', sender: '客服人員', time: '2026/04/19 11:15 AM' },
        { type: 'user', text: '好的，謝謝！', time: '2026/04/19 11:20 AM' }
      ]
    },
    'LS20260410-002': {
      orderId: 'LS20260410-002',
      status: '已完成',
      statusClass: 'status-completed',
      serviceName: 'Sparkle 汽車美容',
      serviceItem: '精緻手工洗車',
      price: '$500',
      date: '2026/04/12',
      contactPeriod: '上午',
      unit: 'A3-3',
      name: '王小明',
      phone: '0912-345-678',
      note: '白色 Tesla Model 3，停放 B1 車位 #23。',
      completedDate: '2026/04/12',
      completedNote: '手工洗車已完成，含外觀清洗、輪框清潔及內裝除塵（住戶首次免費）。車輛已停回原位。',
      messages: [
        { type: 'user', text: '車子停在 B1 #23，鑰匙放警衛室', time: '2026/04/12 08:45 AM' },
        { type: 'agent', text: '收到！預計 10:30 完成，會通知您取車。', sender: '客服人員', time: '2026/04/12 09:00 AM' },
        { type: 'agent', text: '洗車已完成，鑰匙已歸還警衛室，感謝您的使用！', sender: '客服人員', time: '2026/04/12 10:25 AM' }
      ]
    },
    'LS20260328-003': {
      orderId: 'LS20260328-003',
      status: '已取消',
      statusClass: 'status-cancelled',
      serviceName: '森覺鍋物 Senn shabu',
      serviceItem: '雙人精緻套餐',
      price: '$1,680',
      date: '2026/03/30',
      contactPeriod: '下午',
      unit: 'A3-3',
      name: '王小明',
      phone: '0912-345-678',
      note: '需要靠窗座位。',
      completedDate: '',
      completedNote: '',
      messages: [
        { type: 'user', text: '不好意思，臨時有事需要取消預約', time: '2026/03/29 14:00 PM' },
        { type: 'agent', text: '好的，已為您取消此次預約，歡迎下次再預約！', sender: '客服人員', time: '2026/03/29 14:30 PM' }
      ]
    },
    'LS20260405-005': {
      orderId: 'LS20260405-005',
      status: '已取消服務',
      statusClass: 'status-service-cancelled',
      serviceName: '百香狗寵物美容',
      serviceItem: '大型犬洗澡美容',
      price: '$1,200',
      date: '2026/04/08',
      contactPeriod: '上午',
      unit: 'A3-3',
      name: '王小明',
      phone: '0912-345-678',
      note: '黃金獵犬，約 30 公斤。',
      completedDate: '',
      completedNote: '',
      messages: [
        { type: 'agent', text: '您好，很抱歉因廠商人力調度問題，此次預約需由我們協助取消，造成不便敬請見諒。', sender: '客服人員', time: '2026/04/06 10:00 AM' }
      ]
    }
  };

  /* ------------------------------------------
     讀取 URL 參數
     ------------------------------------------ */
  var urlParams = new URLSearchParams(window.location.search);
  var orderId = urlParams.get('order');
  var data = bookingData[orderId];

  /* ------------------------------------------
     填入頁面資料
     ------------------------------------------ */
  if (data) {
    // 單號
    var orderNoEl = document.getElementById('bookingOrderNo');
    if (orderNoEl) orderNoEl.textContent = data.orderId;

    // 狀態標籤
    var badgeEl = document.getElementById('statusBadge');
    if (badgeEl) {
      badgeEl.querySelector('span').textContent = data.status;
      badgeEl.className = 'status-badge ' + data.statusClass;
    }

    // 詳細資訊
    var fields = {
      detailServiceName: data.serviceName,
      detailServiceItem: data.serviceItem,
      detailPrice: data.price,
      detailDate: data.date,
      detailUnit: data.unit,
      detailName: data.name,
      detailPhone: data.phone,
      detailContactPeriod: data.contactPeriod,
      detailNote: data.note
    };

    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = fields[id];
    });

    // 根據狀態規則控制各區塊顯示
    var rules = STATUS_RULES[data.status] || STATUS_RULES['待確認'];

    // 已完成狀態顯示完成資訊
    var completionInfo = document.getElementById('completionInfo');
    if (completionInfo) {
      if (rules.showCompletion) {
        completionInfo.style.display = '';
        var completedDateEl = document.getElementById('detailCompletedDate');
        if (completedDateEl) completedDateEl.textContent = data.completedDate;
      } else {
        completionInfo.style.display = 'none';
      }
    }

    // 取消預約按鈕（待確認、已確認才顯示）
    var btnCancel = document.getElementById('btnCancelBooking');
    if (btnCancel) {
      btnCancel.style.display = rules.canCancel ? '' : 'none';
    }

    // 留言板區塊（已取消不顯示）
    var chatSection = document.querySelector('.chat-section');
    if (chatSection) {
      chatSection.style.display = rules.canMessage ? '' : 'none';
    }

    // 渲染留言板
    var chatMessages = document.getElementById('chatMessages');
    if (chatMessages && data.messages && data.messages.length > 0) {
      chatMessages.innerHTML = '';
      data.messages.forEach(function (msg) {
        if (msg.type === 'user') {
          var userDiv = document.createElement('div');
          userDiv.className = 'chat-msg-user';
          userDiv.innerHTML =
            '<div class="msg-bubble">' + escapeHtml(msg.text) + '</div>' +
            '<p class="msg-time">' + escapeHtml(msg.time) + '</p>';
          chatMessages.appendChild(userDiv);
        } else {
          var agentDiv = document.createElement('div');
          agentDiv.className = 'chat-msg-agent';
          agentDiv.innerHTML =
            '<div class="msg-bubble">' + escapeHtml(msg.text) + '</div>' +
            '<p class="msg-sender">' + escapeHtml(msg.sender) + ' ' + escapeHtml(msg.time) + '</p>';
          chatMessages.appendChild(agentDiv);
        }
      });
    }
  }

  /* ------------------------------------------
     HTML 跳脫工具
     ------------------------------------------ */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ------------------------------------------
     取消預約按鈕
     ------------------------------------------ */
  var btnCancelBooking = document.getElementById('btnCancelBooking');
  if (btnCancelBooking) {
    btnCancelBooking.addEventListener('click', function () {
      if (!confirm('確定要取消此預約嗎？取消後無法復原。')) return;
      // 更新頁面狀態顯示
      var badgeEl = document.getElementById('statusBadge');
      if (badgeEl) {
        badgeEl.querySelector('span').textContent = '已取消';
        badgeEl.className = 'status-badge status-cancelled';
      }
      btnCancelBooking.style.display = 'none';
      var chatSection = document.querySelector('.chat-section');
      if (chatSection) chatSection.style.display = 'none';
      alert('預約已取消。');
    });
  }

  /* ------------------------------------------
     留言彈窗控制
     ------------------------------------------ */
  var btnLeaveMessage = document.getElementById('btnLeaveMessage');
  var messageOverlay = document.getElementById('messageModalOverlay');
  var btnMsgCancel = document.getElementById('btnMsgCancel');
  var btnMsgSend = document.getElementById('btnMsgSend');
  var messageTextarea = document.getElementById('messageTextarea');
  var messageFileInput = document.getElementById('messageFileInput');
  var selectedFile = document.getElementById('selectedFile');
  var selectedFileName = document.getElementById('selectedFileName');
  var btnRemoveFile = document.getElementById('btnRemoveFile');

  // 開啟留言彈窗
  if (btnLeaveMessage && messageOverlay) {
    btnLeaveMessage.addEventListener('click', function () {
      messageOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (messageTextarea) messageTextarea.focus();
    });
  }

  // 關閉留言彈窗
  function closeMessageModal() {
    if (!messageOverlay) return;
    messageOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (messageTextarea) messageTextarea.value = '';
    if (messageFileInput) messageFileInput.value = '';
    if (selectedFile) selectedFile.style.display = 'none';
  }

  if (btnMsgCancel) {
    btnMsgCancel.addEventListener('click', closeMessageModal);
  }

  // 點擊遮罩關閉
  if (messageOverlay) {
    messageOverlay.addEventListener('click', function (e) {
      if (e.target === messageOverlay) closeMessageModal();
    });
  }

  // 選擇檔案
  if (messageFileInput) {
    messageFileInput.addEventListener('change', function () {
      var file = messageFileInput.files[0];
      if (file) {
        // 驗證檔案大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('檔案大小不可超過 5MB');
          messageFileInput.value = '';
          return;
        }
        if (selectedFileName) selectedFileName.textContent = file.name;
        if (selectedFile) selectedFile.style.display = 'flex';
      }
    });
  }

  // 移除檔案
  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', function () {
      if (messageFileInput) messageFileInput.value = '';
      if (selectedFile) selectedFile.style.display = 'none';
    });
  }

  // 發送訊息
  if (btnMsgSend) {
    btnMsgSend.addEventListener('click', function () {
      var text = messageTextarea ? messageTextarea.value.trim() : '';
      if (!text) {
        alert('請輸入訊息內容');
        return;
      }

      // 新增使用者訊息到留言板
      var chatMessages = document.getElementById('chatMessages');
      if (chatMessages) {
        var now = new Date();
        var timeStr = now.getFullYear() + '/' +
          String(now.getMonth() + 1).padStart(2, '0') + '/' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0');

        var userDiv = document.createElement('div');
        userDiv.className = 'chat-msg-user';
        userDiv.innerHTML =
          '<div class="msg-bubble">' + escapeHtml(text) + '</div>' +
          '<p class="msg-time">' + escapeHtml(timeStr) + '</p>';
        chatMessages.appendChild(userDiv);

        // 滾動到底部
        var chatArea = chatMessages.closest('.chat-area');
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
      }

      closeMessageModal();
      alert('訊息已送出！');
    });
  }

})();
