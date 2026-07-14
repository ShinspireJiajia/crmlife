/* ============================================
   款項資訊頁面互動邏輯
   彙整各項服務的已繳款 / 未繳款 / 已逾期 / 已取消費用
   資料依分類分組呈現：房屋款項、對保服務、客變服務、
   綠海個案單、案場活動、基金會活動
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 狀態標籤 / 樣式對照 ---
  var STATUS_LABEL = {
    paid: '已付款',
    unpaid: '未繳款',
    overdue: '已逾期',
    cancelled: '已取消'
  };
  var STATUS_CLASS = {
    paid: 'status-paid',
    unpaid: 'status-unpaid',
    overdue: 'status-overdue',
    cancelled: 'status-cancelled'
  };
  // 未繳款 / 已逾期 才需顯示付款資訊區塊
  var SHOW_BANK_INFO_STATUS = { unpaid: true, overdue: true };

  // --- 交易狀態篩選選項 ---
  var STATUS_FILTER_OPTIONS = [
    { value: 'all', label: '全部' },
    { value: 'paid', label: '已付款' },
    { value: 'unpaid', label: '未繳款' },
    { value: 'overdue', label: '已逾期' },
    { value: 'cancelled', label: '已取消' }
  ];

  // --- 目前篩選狀態 ---
  var currentGroupFilter = 'all';
  var currentStatusFilter = 'all';

  // --- Mock 資料：依分類分組的款項項目 ---
  var paymentGroups = [
    {
      group: '房屋款項',
      items: [
        {
          title: '第一期／訂金',
          status: 'paid',
          amount: 2980000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' },
            { label: '繳款日期', value: '2025/01/06' }
          ],
          href: 'crm-payment-detail.html?id=pay001'
        },
        {
          title: '第二期／簽約金',
          status: 'paid',
          amount: 5970000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' },
            { label: '繳款日期', value: '2025/01/06' }
          ],
          href: 'crm-payment-detail.html?id=pay002'
        },
        {
          title: '第三期／開工款',
          status: 'unpaid',
          amount: 2980000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '帳號', value: '7109-4521-3258' }
            ]
          },
          href: 'crm-payment-detail.html?id=pay003'
        },
        {
          title: '第四期／交屋尾款',
          status: 'unpaid',
          amount: 11000000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '帳號', value: '7109-4521-3258' }
            ]
          },
          href: 'crm-payment-detail.html?id=pay004'
        }
      ]
    },
    {
      group: '對保服務',
      items: [
        {
          title: '對保預約代辦費',
          status: 'unpaid',
          amount: 500000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' },
            { label: '繳款期限', value: '2025/09/05' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '帳號', value: '7109-4521-3258' }
            ]
          },
          href: 'crm-guarantee-reserve.html'
        }
      ]
    },
    {
      group: '客變服務',
      items: [
        {
          title: '客變預約代辦費',
          status: 'unpaid',
          amount: 80000,
          meta: [
            { label: '繳款方式', value: '銀行轉帳' },
            { label: '繳款期限', value: '2025/09/05' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '戶別', value: '013' },
              { label: '銀行名稱', value: '國泰銀行' },
              { label: '帳號', value: '015141414559' }
            ]
          },
          href: 'crm-reserve-form.html'
        }
      ]
    },
    {
      group: '綠海個案單',
      items: [
        {
          title: '綠海維修報價單',
          status: 'unpaid',
          amount: 8500,
          meta: [
            { label: '問題描述', value: '陽台落地窗軌道卡住，無法順利開合' },
            { label: '繳款方式', value: '線上刷卡／LINE Pay／ATM 轉帳' },
            { label: '報價確認日期', value: '2025/09/10' }
          ],
          action: {
            label: '查看報價單',
            href: 'crm-repair-quotation-detail.html?quotationNo=GC-20250910-0004-Q1&order=20250910-004&amount=8,500'
          },
          href: 'crm-repair-detail.html?order=20250910-004&status=已完成&hasQuotation=true&paymentStatus=confirmed&quotationNo=GC-20250910-0004-Q1&amount=8,500'
        },
        {
          title: '個案單報修報價單',
          status: 'paid',
          amount: 15750,
          meta: [
            { label: '問題描述', value: '客廳天花板有明顯水漬痕跡' },
            { label: '繳款方式', value: '信用卡' },
            { label: '繳款日期', value: '2025/08/20' }
          ],
          href: 'crm-repair-detail.html?order=20250820-005&status=已完成&hasQuotation=true&paymentStatus=paid&quotationNo=GC-20250820-0005-Q1&amount=15,750'
        }
      ]
    },
    {
      group: '案場活動',
      items: [
        {
          title: '打開植深館｜Into the Forest Living',
          status: 'unpaid',
          amount: 600,
          meta: [
            { label: '繳款方式', value: 'ATM 虛擬帳號轉帳' },
            { label: '繳費期限', value: '2026/02/12 23:59' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '帳號', value: '822-123456789012' }
            ]
          },
          href: 'crm-forest-detail.html?id=event-forest'
        },
        {
          title: '魯千千 & Richie Goods 爵士二重奏',
          status: 'paid',
          amount: 600,
          meta: [
            { label: '繳款方式', value: '信用卡' },
            { label: '繳款日期', value: '2025/09/26' }
          ],
          href: 'crm-forest-list.html?tab=registered'
        },
        {
          title: '魯千千 & Richie Goods 爵士二重奏',
          status: 'cancelled',
          amount: 600,
          meta: [
            { label: '繳款方式', value: 'LINE PAY' }
          ],
          href: 'crm-forest-list.html?tab=registered'
        }
      ]
    },
    {
      group: '基金會活動',
      items: [
        {
          title: '聆聽寂靜：追尋自然聲景',
          status: 'overdue',
          amount: 200,
          meta: [
            { label: '繳款方式', value: 'ATM 虛擬帳號轉帳' },
            { label: '繳費期限', value: '2025/10/10' }
          ],
          bankInfo: {
            title: '付款資訊',
            rows: [
              { label: '帳號', value: '7109-4521-3258' }
            ]
          },
          href: 'crm-forest-foundation-detail.html?id=foundation-nature-sound'
        },
        {
          title: '聆聽寂靜：追尋自然聲景',
          status: 'paid',
          amount: 200,
          meta: [
            { label: '繳款方式', value: '信用卡' },
            { label: '繳款日期', value: '2025/09/24' }
          ],
          href: 'crm-forest-foundation-detail.html?id=foundation-nature-sound'
        }
      ]
    }
  ];

  var mainContent = document.getElementById('paymentGroupsList');
  var groupFilterRow = document.getElementById('groupFilterRow');
  var statusFilterRow = document.getElementById('statusFilterRow');

  // --- 使用者可用點數（Mock，示意用；實際串接 API 時改為後端回傳，並與公設預約頁同步） ---
  var pointsBalance = 320;
  var pointsBalanceEl = document.getElementById('pointsBalance');
  if (pointsBalanceEl) pointsBalanceEl.textContent = pointsBalance;

  // --- 格式化金額 ---
  function formatAmount(num) {
    return '＄ ' + num.toLocaleString('en-US');
  }

  // --- 渲染單張款項卡片 ---
  function renderCard(item) {
    var statusClass = STATUS_CLASS[item.status] || 'status-unpaid';
    var statusText = STATUS_LABEL[item.status] || '未繳款';
    var cardClass = item.href ? 'payment-card is-clickable' : 'payment-card';
    var hrefAttr = item.href ? ' data-href="' + item.href + '"' : '';

    var html = '<div class="' + cardClass + '"' + hrefAttr + '>';

    // 標題列
    html += '<div class="payment-card-header">' +
      '<p class="payment-card-title">' + item.title + '</p>' +
      '<span class="payment-status ' + statusClass + '">' + statusText + '</span>' +
    '</div>';

    // 金額列
    html += '<div class="payment-amount-row">' +
      '<span class="amount-label">金額</span>' +
      '<span class="amount-value">' + formatAmount(item.amount) + '</span>' +
    '</div>';

    // 備註資訊（繳款方式、日期、問題描述等）
    if (item.meta && item.meta.length > 0) {
      html += '<div class="payment-meta">';
      item.meta.forEach(function (row) {
        html += '<p class="meta-row"><span class="meta-label">' + row.label + '｜</span>' + row.value + '</p>';
      });
      html += '</div>'; // /payment-meta
    }

    // 未繳款 / 已逾期：顯示付款資訊
    if (SHOW_BANK_INFO_STATUS[item.status] && item.bankInfo) {
      html += '<div class="payment-info-box">' +
        '<p class="payment-info-box-title">' + item.bankInfo.title + '</p>';
      item.bankInfo.rows.forEach(function (row) {
        html += '<p class="payment-info-row">' + row.label + ' ' + row.value + '</p>';
      });
      html += '</div>';
    }

    // 動作按鈕（例如：查看報價單）
    if (item.action) {
      html += '<button type="button" class="btn-payment-action" data-href="' + item.action.href + '">' +
        item.action.label +
      '</button>';
    }

    html += '</div>'; // /payment-card
    return html;
  }

  // --- 渲染分類頁籤（第一層：主要大分類） ---
  function renderGroupFilter() {
    if (!groupFilterRow) return;

    var html = '<button type="button" class="group-tab' + (currentGroupFilter === 'all' ? ' active' : '') + '" data-group="all">全部</button>';
    paymentGroups.forEach(function (group) {
      var isActive = currentGroupFilter === group.group;
      html += '<button type="button" class="group-tab' + (isActive ? ' active' : '') + '" data-group="' + group.group + '">' + group.group + '</button>';
    });
    groupFilterRow.innerHTML = html;

    groupFilterRow.querySelectorAll('.group-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentGroupFilter = tab.getAttribute('data-group');
        renderGroupFilter();
        renderList();
      });
    });
  }

  // --- 渲染交易狀態篩選列 ---
  function renderStatusFilter() {
    if (!statusFilterRow) return;

    var html = '';
    STATUS_FILTER_OPTIONS.forEach(function (option) {
      var isActive = currentStatusFilter === option.value;
      html += '<button type="button" class="filter-chip' + (isActive ? ' active' : '') + '" data-status="' + option.value + '">' + option.label + '</button>';
    });
    statusFilterRow.innerHTML = html;

    statusFilterRow.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        currentStatusFilter = chip.getAttribute('data-status');
        renderStatusFilter();
        renderList();
      });
    });
  }

  // --- 渲染整體列表（依分類分組，套用目前篩選條件） ---
  function renderList() {
    if (!mainContent) return;

    var visibleGroups = paymentGroups
      .filter(function (group) {
        return currentGroupFilter === 'all' || currentGroupFilter === group.group;
      })
      .map(function (group) {
        var items = group.items.filter(function (item) {
          return currentStatusFilter === 'all' || currentStatusFilter === item.status;
        });
        return { group: group.group, items: items };
      })
      .filter(function (group) {
        return group.items.length > 0;
      });

    if (visibleGroups.length === 0) {
      mainContent.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-icon">' +
            '<img src="assets/empty-record-icon.svg" alt="">' +
          '</div>' +
          '<p class="empty-text">沒有符合篩選條件的款項</p>' +
        '</div>';
      return;
    }

    var html = '';
    visibleGroups.forEach(function (group) {
      html += '<div class="payment-group">' +
        '<p class="payment-group-title">' + group.group + '</p>';
      group.items.forEach(function (item) {
        html += renderCard(item);
      });
      html += '</div>'; // /payment-group
    });
    mainContent.innerHTML = html;

    // 卡片點擊：導向關聯的活動詳情頁
    var cards = mainContent.querySelectorAll('.payment-card.is-clickable');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var href = card.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });

    // 動作按鈕點擊：導向對應功能頁面（如報價單），並避免觸發卡片本身的導向
    var actionButtons = mainContent.querySelectorAll('.btn-payment-action');
    actionButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var href = btn.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });
  }

  renderGroupFilter();
  renderStatusFilter();
  renderList();

});
