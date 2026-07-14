/* ============================================
   報價單內容頁面互動邏輯
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- 從 URL 參數讀取資訊 ---
  var urlParams = new URLSearchParams(window.location.search);
  var quotationNo = urlParams.get('quotationNo') || 'GC-20251204-0001-Q1';
  var payAmountVal = urlParams.get('amount') || '15,750';
  var caseNo = urlParams.get('order') || '';

  // --- Mock 報價單明細資料 ---
  var mockQuotationData = {
    'GC-20251204-0001-Q1': {
      customer: '王大明',
      project: '綠海建案',
      unit: 'A3-3',
      date: '2025/12/04',
      validDate: '2026/01/03',
      description: '客廳浴室的洗手台水龍頭止水墊片老化更換，含工資與材料費。',
      items: [
        { name: '止水墊片（陶瓷芯）', qty: 2, amount: 1200 },
        { name: '水龍頭拆裝工資', qty: 1, amount: 3000 },
        { name: '矽利康防水膠施作', qty: 1, amount: 800 },
        { name: '水路檢測費', qty: 1, amount: 2000 },
        { name: '配管耗材', qty: 1, amount: 1500 },
        { name: '廢棄物清運', qty: 1, amount: 500 }
      ],
      taxRate: 0.05
    },
    'GC-20250905-0003-Q1': {
      customer: '王大明',
      project: '綠海建案',
      unit: 'A3-3',
      date: '2025/09/05',
      validDate: '2025/10/05',
      description: '主臥浴室排水孔堵塞疏通，含管線檢修與清潔。',
      items: [
        { name: '排水管高壓疏通', qty: 1, amount: 4500 },
        { name: '管路內視鏡檢查', qty: 1, amount: 2500 },
        { name: '排水蓋更換', qty: 1, amount: 1200 },
        { name: '清潔復原工資', qty: 1, amount: 2000 },
        { name: '耗材費用', qty: 1, amount: 990 }
      ],
      taxRate: 0.05
    },
    'GC-20250910-0004-Q1': {
      customer: '王大明',
      project: '綠海建案',
      unit: 'A3-3',
      date: '2025/09/10',
      validDate: '2025/10/10',
      description: '陽台落地窗軌道卡住修繕，含軌道更換及五金調整。',
      items: [
        { name: '鋁合金軌道更換', qty: 1, amount: 3500 },
        { name: '滑輪組更換', qty: 2, amount: 1600 },
        { name: '五金調校工資', qty: 1, amount: 2000 },
        { name: '潤滑保養材料', qty: 1, amount: 500 }
      ],
      taxRate: 0.05
    },
    'GC-20250820-0005-Q1': {
      customer: '王大明',
      project: '綠海建案',
      unit: 'A3-3',
      date: '2025/08/20',
      validDate: '2025/09/19',
      description: '客廳天花板水漬修繕，含漏水點檢修及天花板重新批土粉刷。',
      items: [
        { name: '漏水點檢修（含試水）', qty: 1, amount: 5000 },
        { name: '天花板批土整平', qty: 1, amount: 3500 },
        { name: '乳膠漆粉刷（含底漆）', qty: 1, amount: 4000 },
        { name: '防水塗料施作', qty: 1, amount: 2000 },
        { name: '耗材及清運費', qty: 1, amount: 500 }
      ],
      taxRate: 0.05
    }
  };

  // 取得對應的報價單資料（找不到則使用第一筆）
  var data = mockQuotationData[quotationNo] || mockQuotationData['GC-20251204-0001-Q1'];

  // --- 填入報價單資訊 ---
  var displayQuotationNoEl = document.getElementById('displayQuotationNo');
  if (displayQuotationNoEl) displayQuotationNoEl.textContent = quotationNo;

  var infoCustomer = document.getElementById('infoCustomer');
  var infoProject = document.getElementById('infoProject');
  var infoUnit = document.getElementById('infoUnit');
  var infoDate = document.getElementById('infoDate');
  var infoValidDate = document.getElementById('infoValidDate');
  var infoCaseNo = document.getElementById('infoCaseNo');
  var infoDescription = document.getElementById('infoDescription');

  if (infoCustomer) infoCustomer.textContent = data.customer;
  if (infoProject) infoProject.textContent = data.project;
  if (infoUnit) infoUnit.textContent = data.unit;
  if (infoDate) infoDate.textContent = data.date;
  if (infoValidDate) infoValidDate.textContent = data.validDate;
  if (infoCaseNo) infoCaseNo.textContent = caseNo || quotationNo.replace(/-Q\d+$/, '');
  if (infoDescription) infoDescription.textContent = data.description;

  // --- 產生報價明細表格 ---
  var detailBody = document.getElementById('quotationDetailBody');
  var subtotal = 0;

  if (detailBody && data.items) {
    data.items.forEach(function (item, index) {
      subtotal += item.amount;
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + (index + 1) + '</td>' +
        '<td class="td-item">' + item.name + '</td>' +
        '<td>' + item.qty + '</td>' +
        '<td>NT$ ' + item.amount.toLocaleString() + '</td>';
      detailBody.appendChild(tr);
    });
  }

  // --- 金額匯總 ---
  var tax = Math.round(subtotal * data.taxRate);
  var total = subtotal + tax;

  var summarySubtotal = document.getElementById('summarySubtotal');
  var summaryTax = document.getElementById('summaryTax');
  var summaryTotal = document.getElementById('summaryTotal');

  if (summarySubtotal) summarySubtotal.textContent = 'NT$ ' + subtotal.toLocaleString();
  if (summaryTax) summaryTax.textContent = 'NT$ ' + tax.toLocaleString();
  if (summaryTotal) summaryTotal.textContent = 'NT$ ' + total.toLocaleString();

  // --- 返回報修單按鈕 ---
  var btnBackToDetail = document.getElementById('btnBackToDetail');
  if (btnBackToDetail) {
    btnBackToDetail.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-index_life.html';
      }
    });
  }

});
