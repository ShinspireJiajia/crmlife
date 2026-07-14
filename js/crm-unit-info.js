/* ============================================
   戶別資訊頁面互動邏輯
   根據 Figma 設計稿 (node-id: 1:5046)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Mock 戶別資料 ---
  var unitData = [
    {
      id: 'unit-001',
      name: '陸府續森 / A 棟 3F-1',
      address: '台中市南屯區益豐路四段590號',
      actions: [
        { label: '房屋保固', type: 'warranty' },
        { label: '建案工程進度', type: 'progress' },
        { label: '合約紀錄', type: 'contract' },
        { label: '履約款項', type: 'payment' }
      ]
    },
    {
      id: 'unit-002',
      name: '陸府續森 / B 棟 3F-1',
      address: '台中市南屯區益豐路四段590號',
      actions: [
        { label: '房屋保固', type: 'warranty' },
        { label: '建案工程進度', type: 'progress' },
        { label: '合約紀錄', type: 'contract' },
        { label: '履約款項', type: 'payment' }
      ]
    }
  ];

  // --- 渲染戶別卡片 ---
  var cardList = document.getElementById('unitCardList');

  /**
   * 建立單一戶別卡片 HTML
   * @param {Object} unit - 戶別資料物件
   * @returns {string} 卡片 HTML 字串
   */
  function createUnitCard(unit) {
    // 將功能按鈕每兩個分一列
    var rows = '';
    for (var i = 0; i < unit.actions.length; i += 2) {
      var btn1 = unit.actions[i];
      var btn2 = unit.actions[i + 1];
      rows += '<div class="unit-card-actions-row">';
      rows += '<button class="unit-action-btn" data-unit-id="' + unit.id + '" data-type="' + btn1.type + '">' + btn1.label + '</button>';
      if (btn2) {
        rows += '<button class="unit-action-btn" data-unit-id="' + unit.id + '" data-type="' + btn2.type + '">' + btn2.label + '</button>';
      }
      rows += '</div>';
    }

    return '' +
      '<div class="unit-card" data-unit-id="' + unit.id + '">' +
        '<div class="unit-card-header">' +
          '<p class="unit-card-name">' + unit.name + '</p>' +
          '<img class="chevron-icon" src="assets/chevron-right-gold.svg" alt="">' +
        '</div>' +
        '<div class="unit-card-address">' +
          '<img class="location-icon" src="assets/location-icon.svg" alt="">' +
          '<span>' + unit.address + '</span>' +
        '</div>' +
        '<div class="unit-card-actions">' +
          rows +
        '</div>' +
      '</div>';
  }

  // 渲染所有卡片
  if (cardList) {
    var html = '';
    for (var i = 0; i < unitData.length; i++) {
      html += createUnitCard(unitData[i]);
    }
    cardList.innerHTML = html;
  }

  // --- 卡片標題列點擊導航 ---
  if (cardList) {
    cardList.addEventListener('click', function (e) {
      // 判斷是否點擊標題列
      var header = e.target.closest('.unit-card-header');
      if (header) {
        var card = header.closest('.unit-card');
        var unitId = card ? card.getAttribute('data-unit-id') : '';
        console.log('查看戶別詳情：' + unitId);
        return;
      }

      // 判斷是否點擊功能按鈕
      var btn = e.target.closest('.unit-action-btn');
      if (btn) {
        var actionType = btn.getAttribute('data-type');
        var actionUnitId = btn.getAttribute('data-unit-id');
        // 對應分頁參數
        var tabMap = {
          warranty: 'warranty',
          progress: 'progress',
          contract: 'contract',
          payment: 'payment'
        };
        var tab = tabMap[actionType];
        if (tab) {
          window.location.href = 'crm-unit-detail.html?tab=' + tab + '&unitId=' + encodeURIComponent(actionUnitId);
        }
      }
    });
  }

});
