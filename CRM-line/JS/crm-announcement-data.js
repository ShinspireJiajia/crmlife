/* ============================================
   社區公告 — 共用資料與已讀狀態
   由 crm-announcement-list.html / crm-announcement-detail.html
   / crm-index_life.html 共同載入使用
   ============================================ */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'crmAnnouncementReadIds';

  // 分類標籤對照
  var CATEGORY_LABELS = {
    important: '重要公告',
    'water-power': '停水停電',
    activity: '社區活動',
    maintenance: '維修保養'
  };

  // 公告資料（依日期新到舊排列）
  var ANNOUNCEMENT_DATA = [
    {
      id: 'ann-001',
      category: 'important',
      pinned: true,
      date: '2026-07-10',
      title: '2026 年度社區住戶大會通知',
      summary: '茲訂於 2026/07/20（日）上午 10:00 假社區活動中心召開年度住戶大會，敬請住戶準時出席。',
      content: [
        '各位住戶好，',
        '茲訂於 2026 年 7 月 20 日（星期日）上午 10:00，假社區一樓活動中心召開年度住戶大會，討論事項如下：',
        '一、112 年度管理費收支報告。\n二、中庭電梯汰換工程進度報告。\n三、社區公共安全巡檢計畫討論。\n四、其他臨時動議。',
        '請各戶派代表出席，若無法親自出席，請填寫委託書委由他人代為出席並行使表決權。委託書可至管理中心索取。',
        '管理委員會 敬啟'
      ]
    },
    {
      id: 'ann-002',
      category: 'water-power',
      pinned: false,
      date: '2026-07-08',
      title: '公共用水管線更新工程停水通知',
      summary: '因辦理公共用水管線汰換工程，將於指定時間暫停供水，請儲水備用。',
      content: [
        '因社區公共用水管線老舊，將辦理汰換更新工程，工程期間將暫停供水，說明如下：',
        '停水時間：2026 年 7 月 15 日（三）09:00 至 17:00。\n影響範圍：全社區 A 棟、B 棟。',
        '請住戶提前儲水備用，如有緊急用水需求，請洽一樓管理中心協助。造成不便，敬請見諒。',
        '管理委員會 敬啟'
      ]
    },
    {
      id: 'ann-003',
      category: 'activity',
      pinned: false,
      date: '2026-07-05',
      title: '中庭花園夏日親子市集活動',
      summary: '邀請全體住戶攜家帶眷參加中庭花園夏日市集，現場備有手作攤位與消暑冰品。',
      content: [
        '炎炎夏日，社區特別籌辦「夏日親子市集」，邀請全體住戶攜家帶眷共襄盛舉！',
        '活動時間：2026 年 7 月 26 日（日）16:00 至 19:00。\n活動地點：中庭花園廣場。\n活動內容：手作攤位、消暑冰品、親子遊戲區。',
        '活動全程免費參加，歡迎邀請親友一同蒞臨，現場並備有園藝小盆栽供住戶帶回。'
      ]
    },
    {
      id: 'ann-004',
      category: 'maintenance',
      pinned: false,
      date: '2026-07-03',
      title: 'B 棟電梯例行保養公告',
      summary: 'B 棟電梯將進行每月例行保養，保養期間該棟電梯將暫停使用一部。',
      content: [
        'B 棟電梯將進行每月例行保養作業，說明如下：',
        '保養時間：2026 年 7 月 12 日（日）09:00 至 12:00。\n保養範圍：B 棟 2 號電梯。',
        '保養期間該部電梯將暫停使用，請住戶改搭乘 1 號電梯，或改由樓梯通行，不便之處敬請見諒。'
      ]
    },
    {
      id: 'ann-005',
      category: 'important',
      pinned: false,
      date: '2026-06-28',
      title: '社區門禁卡更換作業通知',
      summary: '因應保全系統升級，社區將統一更換門禁卡，請住戶依排定時段至管理中心辦理。',
      content: [
        '為提升社區安全，保全系統將進行升級，原有門禁卡將同步停用，請住戶於期限內完成換卡：',
        '換卡期間：2026 年 7 月 1 日至 7 月 31 日。\n換卡地點：一樓管理中心。\n需攜帶證件：身分證正本、原門禁卡。',
        '逾期未更換者，原門禁卡將於 8 月 1 日起停用，請住戶把握時間辦理，不便之處敬請見諒。'
      ]
    },
    {
      id: 'ann-006',
      category: 'activity',
      pinned: false,
      date: '2026-06-20',
      title: '社區資源回收日調整公告',
      summary: '配合清潔隊作業時間調整，社區資源回收日將由每週二改為每週三。',
      content: [
        '配合台中市清潔隊回收車班調整，社區資源回收日自 2026 年 7 月起異動如下：',
        '原定回收日：每週二。\n調整後回收日：每週三 07:00 至 09:00。',
        '請住戶配合於回收當日將資源垃圾放置於一樓回收區，其餘時間請勿提前放置，謝謝配合。'
      ]
    }
  ];

  function getReadIds() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function isRead(id) {
    return getReadIds().indexOf(id) !== -1;
  }

  function markRead(id) {
    var ids = getReadIds();
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      try {
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch (e) {
        /* localStorage 不可用時略過已讀記錄 */
      }
    }
  }

  function getUnreadCount() {
    var readIds = getReadIds();
    return ANNOUNCEMENT_DATA.filter(function (item) {
      return readIds.indexOf(item.id) === -1;
    }).length;
  }

  function getById(id) {
    for (var i = 0; i < ANNOUNCEMENT_DATA.length; i++) {
      if (ANNOUNCEMENT_DATA[i].id === id) return ANNOUNCEMENT_DATA[i];
    }
    return null;
  }

  global.CrmAnnouncement = {
    data: ANNOUNCEMENT_DATA,
    categoryLabels: CATEGORY_LABELS,
    isRead: isRead,
    markRead: markRead,
    getUnreadCount: getUnreadCount,
    getById: getById
  };
})(window);
