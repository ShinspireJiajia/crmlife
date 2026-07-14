/* ============================================
   服務預約頁面 — 邏輯
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     商家服務資料（含完整說明）
     ------------------------------------------ */
  var serviceData = {
    hoho: {
      name: 'HoHo 居家打掃',
      tagline: '讓家更有溫度的清潔專家',
      badge: '首次 85 折',
      img: 'assets/service5.jpg',
      promo: '本月預約清潔服務即享 85 折優惠，並贈送天然精油空間噴霧乙次。',
      description: 'HoHo 居家打掃為陸府社區住戶提供專業居家清潔服務，由經驗豐富的清潔團隊使用環保無毒清潔劑，為您的居家空間帶來煥然一新的潔淨體驗。所有清潔人員均經過嚴格篩選與專業訓練，確保服務品質。',
      highlights: [
        '使用環保無毒清潔劑，守護家人健康',
        '專業清潔團隊皆通過背景審查與訓練',
        '服務完成後由住戶驗收確認，不滿意可重做',
        '可配合住戶時間彈性安排服務時段'
      ],
      info: {
        '服務範圍': '台中市區到府服務',
        '營業時間': '週一至週六 09:00 - 18:00',
        '預約方式': '至少 3 天前預約',
        '付款方式': '服務完成後現場付款'
      },
      services: [
        { value: '2hrs', name: '專業清潔服務 2HRS', price: '$2,200', desc: '適合定期維護、小坪數空間' },
        { value: '4hrs', name: '專業清潔服務 4HRS', price: '$3,800', desc: '適合大掃除、全屋深度清潔' },
        { value: 'other', name: '其他特殊清潔需求', price: '現場評估', isEstimate: true, desc: '冷氣清洗、除蟎、搬家清潔等' }
      ],
      placeholder: '例如：有養寵物、需加強廚房清潔...'
    },
    senn: {
      name: '森覺鍋物 Senn shabu',
      tagline: '精緻鍋物、暖心美味',
      badge: '贈精緻肉盤',
      img: 'assets/service4.jpg',
      promo: '住戶用餐贈送精緻肉盤乙份，每桌限用一次。',
      description: '森覺鍋物位於社區周邊，堅持使用當日新鮮食材，湯頭由主廚每日熬煮六小時以上，搭配嚴選台灣在地時令蔬菜與頂級肉品，為您呈現最純粹的鍋物美味。寬敞舒適的用餐空間，適合家庭聚餐或朋友小聚。',
      highlights: [
        '每日新鮮直送食材，不使用冷凍庫存',
        '六小時慢熬天然湯頭，無人工添加物',
        '嚴選台灣在地時令蔬菜',
        '提供兒童座椅及餐具，適合親子同行'
      ],
      info: {
        '餐廳地址': '台中市南屯區XX路XX號',
        '營業時間': '11:30 - 14:00 / 17:30 - 21:30',
        '公休日': '每週二公休',
        '付款方式': '現金、信用卡、行動支付'
      },
      services: [
        { value: 'double', name: '雙人精緻套餐', price: '$1,680', desc: '含兩份主餐肉品、菜盤、湯底、甜點' },
        { value: 'family', name: '四人豪華套餐', price: '$3,200', desc: '含四份主餐肉品、雙倍菜盤、兩種湯底' },
        { value: 'single', name: '單人商業午餐', price: '$580', desc: '含一份肉品、菜盤、白飯、飲品' }
      ],
      placeholder: '例如：忌口食材、特殊需求...'
    },
    studio: {
      name: 'THE STUDIO 藝術私廚',
      tagline: '藝術與美食的完美邂逅',
      badge: '滿額折 $100',
      img: 'assets/service1.jpg',
      promo: '住戶消費滿 $2,000 即折 $100，不限次數。',
      description: 'THE STUDIO 藝術私廚結合藝術展覽與精緻料理，每季更換主題菜單，融合法式料理技法與台灣在地食材，為賓客帶來視覺與味覺的雙重饗宴。餐廳內部陳列當代藝術作品，營造獨特的用餐氛圍。',
      highlights: [
        '每季更新創意主題菜單',
        '法式料理技法結合台灣食材',
        '餐廳空間融入當代藝術展覽',
        '可包場舉辦私人聚會或慶祝活動'
      ],
      info: {
        '餐廳地址': '台中市西區XX路XX號',
        '營業時間': '12:00 - 14:30 / 18:00 - 21:00',
        '公休日': '每週一公休',
        '付款方式': '現金、信用卡'
      },
      services: [
        { value: 'double', name: '雙人精選套餐', price: '$2,800', desc: '含前菜、湯品、主餐、甜點、飲品' },
        { value: 'family', name: '四人分享套餐', price: '$4,500', desc: '含精選開胃拼盤、雙主菜、甜點盤' },
        { value: 'single', name: '主廚特製單人餐', price: '$980', desc: '含當季特製前菜、主餐、手工甜點' }
      ],
      placeholder: '例如：過敏食材、慶祝場合...'
    },
    pet: {
      name: '百香狗寵物美容',
      tagline: '毛小孩的頂級呵護專家',
      badge: '滿 500 打 9 折',
      img: 'assets/service2.jpg',
      promo: '住戶消費滿 $500 享 9 折優惠，可與其他優惠併用。',
      description: '百香狗寵物美容由擁有十年以上經驗的專業美容師團隊經營，堅持使用天然溫和洗劑，提供從基礎洗澡到全套造型的完整服務。店內設有獨立美容空間，讓毛孩在舒適放鬆的環境中接受照護。',
      highlights: [
        '十年以上經驗的專業寵物美容師',
        '使用天然溫和洗劑，呵護毛孩肌膚',
        '獨立美容空間，降低毛孩緊張感',
        '美容過程中若發現皮膚異常會主動告知'
      ],
      info: {
        '店家地址': '台中市南屯區XX路XX號',
        '營業時間': '週二至週日 10:00 - 19:00',
        '公休日': '每週一公休',
        '付款方式': '現金、行動支付'
      },
      services: [
        { value: 'basic', name: '基礎洗澡美容', price: '$800', desc: '含洗澡、吹乾、耳朵清潔、指甲修剪' },
        { value: 'full', name: '全套造型美容', price: '$1,500', desc: '含洗澡、造型修剪、SPA 按摩、配件裝飾' },
        { value: 'spa', name: 'SPA 養護套餐', price: '$2,200', desc: '深層護毛、皮膚保養、精油按摩放鬆' }
      ],
      placeholder: '例如：寵物品種、體型大小、特殊注意事項...'
    },
    sparkle: {
      name: 'Sparkle 汽車美容',
      tagline: '愛車煥然一新',
      badge: '免費內裝除塵',
      img: 'assets/service3.jpg',
      promo: '住戶首次洗車享免費內裝除塵。',
      description: 'Sparkle 汽車美容提供專業手工洗車與鍍膜護理服務，使用進口頂級車用清潔產品，由受過原廠訓練的技師操作。不論是日常洗車或深層護理，都能讓愛車恢復亮麗如新的光澤。',
      highlights: [
        '使用進口頂級車用清潔產品',
        '技師受過原廠認證訓練',
        '手工細膩作業，不傷車漆',
        '提供洗車後品質檢查報告'
      ],
      info: {
        '店家地址': '台中市南屯區XX路XX號',
        '營業時間': '週一至週六 09:00 - 18:00',
        '預約方式': '至少 1 天前預約',
        '付款方式': '現金、信用卡、行動支付'
      },
      services: [
        { value: 'wash', name: '精緻手工洗車', price: '$500', desc: '外觀清洗、輪框清潔、玻璃亮光' },
        { value: 'coating', name: '鍍膜護理套餐', price: '$3,600', desc: '車身研磨、奈米鍍膜、持效 6 個月' },
        { value: 'full', name: '全車深層美容', price: '$6,800', desc: '含內外清潔、鍍膜、內裝養護、皮革保養' }
      ],
      placeholder: '例如：車型、特殊需求...'
    },
    carshine: {
      name: '卡爾車體護理',
      tagline: '專業車體美容 到府服務',
      badge: '到府 9 折',
      img: 'assets/service3.jpg',
      promo: '住戶到府洗車享 9 折，兩台以上再折 $100。',
      description: '卡爾車體護理提供便利的到府洗車服務，技師攜帶全套專業設備直接至社區停車場為您服務，免去外出排隊的麻煩。採用環保節水洗車技術，同時兼顧品質與環境保護。',
      highlights: [
        '到府服務，免出門免排隊',
        '環保節水洗車技術',
        '攜帶全套專業設備，品質不打折',
        '社區住戶多車同洗享額外優惠'
      ],
      info: {
        '服務範圍': '社區停車場到府服務',
        '服務時間': '週一至週六 08:00 - 17:00',
        '預約方式': '至少 2 天前預約',
        '付款方式': '現金、行動支付'
      },
      services: [
        { value: 'basic', name: '基礎外觀清洗', price: '$400', desc: '車身清洗、輪框清潔、擦乾' },
        { value: 'interior', name: '內裝深層清潔', price: '$1,200', desc: '座椅吸塵、儀表板清潔、除臭殺菌' },
        { value: 'premium', name: '尊榮全車護理', price: '$5,500', desc: '全車內外深度清潔、打蠟、皮革保養' }
      ],
      placeholder: '例如：車輛停放位置、偏好時段...'
    },
    brunch: {
      name: '晨光早午餐',
      tagline: '用美味喚醒每一天',
      badge: '飲品免費升級',
      img: 'assets/service1.jpg',
      promo: '住戶出示會員頁面享飲品免費升級。',
      description: '晨光早午餐堅持使用小農直送的新鮮食材，麵包每日現烤、雞蛋選用放牧蛋，搭配店內自烘咖啡豆手沖單品咖啡，在明亮溫馨的空間中，為您開啟美好的一天。',
      highlights: [
        '使用小農直送新鮮食材',
        '麵包每日現烤，絕不隔夜',
        '自烘咖啡豆，手沖單品咖啡',
        '明亮溫馨空間，提供免費 WiFi'
      ],
      info: {
        '餐廳地址': '台中市南屯區XX路XX號',
        '營業時間': '週二至週日 08:00 - 15:00',
        '公休日': '每週一公休',
        '付款方式': '現金、行動支付'
      },
      services: [
        { value: 'setA', name: '經典早午餐 A 套餐', price: '$280', desc: '含手工麵包、沙拉、放牧蛋料理、飲品' },
        { value: 'setB', name: '豪華早午餐 B 套餐', price: '$380', desc: '含主餐肉品、手工麵包、沙拉、濃湯、飲品' },
        { value: 'drink', name: '手沖單品咖啡', price: '$120', desc: '每週更換產區豆，附風味說明卡' }
      ],
      placeholder: '例如：用餐人數、座位偏好...'
    },
    yoga: {
      name: '靜心瑜伽工作室',
      tagline: '身心平衡的美好時光',
      badge: '首堂免費',
      img: 'assets/service2.jpg',
      promo: '住戶首堂體驗免費，購買課程包享 85 折。',
      description: '靜心瑜伽工作室由國際認證瑜伽師資帶領，提供從入門到進階的多元課程，包含哈達瑜伽、陰瑜伽、正念冥想等。小班制教學確保每位學員都能獲得細心指導，適合各年齡層與程度的朋友參加。',
      highlights: [
        '國際認證瑜伽師資（RYT-200/500）',
        '小班制教學，每班最多 10 人',
        '提供瑜伽墊、輔具等器材',
        '課前課後提供花草茶，營造放鬆氛圍'
      ],
      info: {
        '教室地址': '台中市南屯區XX路XX號 2F',
        '課程時間': '週一至週六，詳見課表',
        '預約方式': '至少 1 天前預約',
        '付款方式': '現金、轉帳、信用卡'
      },
      services: [
        { value: 'trial', name: '單堂體驗課', price: '免費', desc: '每人限體驗一次，體驗各式瑜伽課程' },
        { value: 'pack10', name: '十堂課程包', price: '$4,500', desc: '可自由搭配課程，有效期限 3 個月' },
        { value: 'private', name: '一對一私人課', price: '$1,200', desc: '依個人需求量身定制課程內容' }
      ],
      placeholder: '例如：偏好時段、身體狀況...'
    },
    laundry: {
      name: '速潔洗衣到府收送',
      tagline: '專業送洗 隔日取件',
      badge: '滿 3 件 9 折',
      img: 'assets/service5.jpg',
      promo: '住戶滿 3 件 9 折，大型寢具免運費。',
      description: '速潔洗衣提供便利的到府收送服務，由專業洗衣工廠以高規格流程處理您的衣物。針對不同材質採用適合的洗滌方式，確保衣物乾淨如新。隔日即可送回，讓忙碌的生活也能輕鬆打理。',
      highlights: [
        '到府收送，不用出門排隊',
        '針對不同材質採用專業洗滌方式',
        '隔日取件，快速又方便',
        '衣物損壞提供合理賠償機制'
      ],
      info: {
        '服務範圍': '社區到府收送',
        '收送時間': '週一至週五 10:00 - 18:00',
        '預約方式': '至少 1 天前預約',
        '付款方式': '取件時現金或行動支付'
      },
      services: [
        { value: 'normal', name: '一般衣物清洗（每件）', price: '$80', desc: '日常衣物水洗、烘乾、摺疊' },
        { value: 'dry', name: '精緻乾洗（每件）', price: '$250', desc: '西裝、絲質、羊毛等精緻材質專用' },
        { value: 'bedding', name: '大型寢具清洗', price: '$600', desc: '棉被、床墊套、羽絨被等大型寢具' }
      ],
      placeholder: '例如：衣物數量、特殊材質...'
    },
    dessert: {
      name: '日和甜點工房',
      tagline: '手工甜點 療癒每一刻',
      badge: '免費配送到府',
      img: 'assets/service4.jpg',
      promo: '住戶訂購蛋糕享免費配送到府。',
      description: '日和甜點工房由留法甜點師主理，堅持使用法國進口奶油、日本麵粉等優質原料，每日限量手工製作。招牌蛋糕系列以天然水果與當季食材入餡，甜而不膩，適合各種節慶或日常甜蜜時光。',
      highlights: [
        '留法甜點師主理，正統法式技法',
        '使用法國進口奶油、日本麵粉',
        '每日限量手工製作，新鮮直送',
        '可客製化生日蛋糕與節慶甜點'
      ],
      info: {
        '店家地址': '台中市西區XX路XX號',
        '營業時間': '週二至週日 11:00 - 19:00',
        '訂購方式': '至少 3 天前預訂（客製化 5 天前）',
        '付款方式': '訂購時預付 50%，取貨付清'
      },
      services: [
        { value: 'cake6', name: '6 吋手工蛋糕', price: '$680', desc: '適合 2-4 人享用，多種口味可選' },
        { value: 'cake8', name: '8 吋手工蛋糕', price: '$980', desc: '適合 6-8 人享用，慶生聚會首選' },
        { value: 'box', name: '精選禮盒（12 入）', price: '$520', desc: '含馬卡龍、費南雪、瑪德蓮等精緻小點' }
      ],
      placeholder: '例如：口味偏好、過敏原...'
    }
  };

  /* ------------------------------------------
     取得 URL 參數中的 service key
     ------------------------------------------ */
  function getServiceKey() {
    var params = new URLSearchParams(window.location.search);
    return params.get('service') || '';
  }

  /* ------------------------------------------
     DOM 元素參照
     ------------------------------------------ */
  var merchantHeroImg = document.getElementById('merchantHeroImg');
  var merchantHeroName = document.getElementById('merchantHeroName');
  var merchantHeroTagline = document.getElementById('merchantHeroTagline');
  var merchantHeroBadge = document.getElementById('merchantHeroBadge');
  var bookPromoDesc = document.getElementById('bookPromoDesc');
  var serviceDetailDesc = document.getElementById('serviceDetailDesc');
  var serviceHighlights = document.getElementById('serviceHighlights');
  var bookServiceSelection = document.getElementById('bookServiceSelection');
  var bookForm = document.getElementById('bookForm');
  var bookTextarea = document.getElementById('bookTextarea');

  // 底部常駐列
  var stickyBarHint = document.getElementById('stickyBarHint');
  var stickyBarSelected = document.getElementById('stickyBarSelected');
  var stickySelectedName = document.getElementById('stickySelectedName');
  var stickySelectedPrice = document.getElementById('stickySelectedPrice');
  var stickyBookBtn = document.getElementById('stickyBookBtn');

  // Modal
  var bookModalOverlay = document.getElementById('bookModalOverlay');
  var bookModalClose = document.getElementById('bookModalClose');
  var modalSummaryName = document.getElementById('modalSummaryName');
  var modalSummaryPrice = document.getElementById('modalSummaryPrice');

  // 記錄當前選中的服務
  var currentSelectedService = null;

  /* ------------------------------------------
     初始化頁面
     ------------------------------------------ */
  function initPage() {
    var serviceKey = getServiceKey();
    var data = serviceData[serviceKey];

    if (!data) {
      // 若找不到對應服務，返回列表頁
      window.location.href = 'crm-life-service-list.html';
      return;
    }

    // 填入商家主視覺資訊
    if (merchantHeroImg) {
      merchantHeroImg.src = data.img;
      merchantHeroImg.alt = data.name;
    }
    if (merchantHeroName) merchantHeroName.textContent = data.name;
    if (merchantHeroTagline) merchantHeroTagline.textContent = data.tagline;

    // 優惠角標
    if (merchantHeroBadge && data.badge) {
      merchantHeroBadge.textContent = data.badge;
      merchantHeroBadge.classList.add('is-visible');
    }

    // 優惠說明
    if (bookPromoDesc) bookPromoDesc.textContent = data.promo;

    // 服務內容說明
    renderServiceDetail(data);

    // 服務項目選擇
    renderServiceOptions(data);

    // 更新備註 placeholder
    if (bookTextarea) bookTextarea.placeholder = data.placeholder || '請輸入備註事項...';

    // 更新頁面標題
    document.title = data.name + ' — 服務預約';
  }

  /* ------------------------------------------
     渲染服務內容說明區塊
     ------------------------------------------ */
  function renderServiceDetail(data) {
    // 服務說明文字
    if (serviceDetailDesc && data.description) {
      serviceDetailDesc.textContent = data.description;
    }

    // 服務亮點
    if (serviceHighlights && data.highlights && data.highlights.length > 0) {
      serviceHighlights.innerHTML = '';
      data.highlights.forEach(function (text) {
        var item = document.createElement('div');
        item.className = 'highlight-item';

        var icon = document.createElement('span');
        icon.className = 'highlight-icon';
        icon.textContent = '✓';

        var content = document.createElement('span');
        content.textContent = text;

        item.appendChild(icon);
        item.appendChild(content);
        serviceHighlights.appendChild(item);
      });
    }


  }

  /* ------------------------------------------
     渲染服務項目選擇（不含簡述）
     ------------------------------------------ */
  function renderServiceOptions(data) {
    if (!bookServiceSelection || !data.services) return;

    bookServiceSelection.innerHTML = '';
    data.services.forEach(function (svc, idx) {
      var label = document.createElement('label');
      label.className = 'book-service-option';

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'bookService';
      radio.value = svc.value;
      if (idx === 0) radio.required = true;

      // 選中狀態樣式 + 更新底部常駐列
      radio.addEventListener('change', function () {
        var allOptions = bookServiceSelection.querySelectorAll('.book-service-option');
        allOptions.forEach(function (opt) { opt.classList.remove('is-selected'); });
        label.classList.add('is-selected');

        // 記錄當前選中服務
        currentSelectedService = { name: svc.name, price: svc.price };

        // 更新底部常駐列
        updateStickyBar(svc.name, svc.price);
      });

      var labelDiv = document.createElement('div');
      labelDiv.className = 'book-service-label';

      var nameSpan = document.createElement('span');
      nameSpan.textContent = svc.name;

      var priceSpan = document.createElement('span');
      priceSpan.className = svc.isEstimate ? '' : 'book-service-price';
      if (svc.isEstimate) priceSpan.style.color = '#999';
      priceSpan.textContent = svc.price;

      labelDiv.appendChild(nameSpan);
      labelDiv.appendChild(priceSpan);
      label.appendChild(radio);
      label.appendChild(labelDiv);
      bookServiceSelection.appendChild(label);
    });
  }

  /* ------------------------------------------
     更新底部常駐列狀態
     ------------------------------------------ */
  function updateStickyBar(name, price) {
    if (stickyBarHint) stickyBarHint.style.display = 'none';
    if (stickyBarSelected) stickyBarSelected.style.display = '';
    if (stickySelectedName) stickySelectedName.textContent = name;
    if (stickySelectedPrice) stickySelectedPrice.textContent = price;
    if (stickyBookBtn) stickyBookBtn.disabled = false;
  }

  /* ------------------------------------------
     預約 Modal 開關
     ------------------------------------------ */
  function openBookModal() {
    if (!bookModalOverlay || !currentSelectedService) return;

    // 填入已選服務摘要
    if (modalSummaryName) modalSummaryName.textContent = currentSelectedService.name;
    if (modalSummaryPrice) modalSummaryPrice.textContent = currentSelectedService.price;

    // 顯示 Modal
    bookModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookModal() {
    if (!bookModalOverlay) return;
    bookModalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // 底部「立即預約」按鈕
  if (stickyBookBtn) {
    stickyBookBtn.addEventListener('click', openBookModal);
  }

  // 關閉按鈕
  if (bookModalClose) {
    bookModalClose.addEventListener('click', closeBookModal);
  }

  // 點擊遮罩背景關閉
  if (bookModalOverlay) {
    bookModalOverlay.addEventListener('click', function (e) {
      if (e.target === bookModalOverlay) closeBookModal();
    });
  }

  /* ------------------------------------------
     表單送出
     ------------------------------------------ */
  if (bookForm) {
    bookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('預約已送出！我們將盡快與您聯繫確認。');
      closeBookModal();
      window.location.href = 'crm-life-service-list.html';
    });
  }

  /* ------------------------------------------
     啟動初始化
     ------------------------------------------ */
  initPage();

})();
