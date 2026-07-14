/* ============================================
   綠海養護 - 合約資訊頁面互動邏輯
   根據 Figma 設計稿
   待簽署 (node-id: 1:3164)
   已簽署 (node-id: 1:3208)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 合約狀態設定
  // 從 URL 參數 status 讀取：signed = 已簽署 / pending = 待簽署
  // ============================================
  var urlParams = new URLSearchParams(window.location.search);
  var contractSigned = (urlParams.get('status') === 'signed');

  // --- DOM 元素 ---
  var btnBack = document.getElementById('btnBack');
  var btnDownload = document.getElementById('btnDownload');
  var signaturePending = document.getElementById('signaturePending');
  var signatureSigned = document.getElementById('signatureSigned');
  var signaturePad = document.getElementById('signaturePad');
  var signaturePlaceholder = document.getElementById('signaturePlaceholder');
  var signatureCanvas = document.getElementById('signatureCanvas');
  var btnClearSign = document.getElementById('btnClearSign');
  var btnConfirmSign = document.getElementById('btnConfirmSign');

  // --- 分頁標籤 ---
  var tabItems = document.querySelectorAll('.tab-item');
  var tabContents = {
    'contract-info': document.getElementById('tabContractInfo'),
    'house-info': document.getElementById('tabHouseInfo'),
    'contract-record': document.getElementById('tabContractRecord'),
    'payment': document.getElementById('tabPayment')
  };

  // --- 根據合約狀態切換顯示 ---
  function updateContractState() {
    if (contractSigned) {
      signaturePending.style.display = 'none';
      signatureSigned.style.display = 'flex';
    } else {
      signaturePending.style.display = 'flex';
      signatureSigned.style.display = 'none';
    }
  }
  updateContractState();

  // --- 返回按鈕 ---
  if (btnBack) {
    btnBack.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'crm-green-care.html';
      }
    });
  }

  // --- 下載合約 ---
  if (btnDownload) {
    btnDownload.addEventListener('click', function () {
      console.log('下載合約文件');
    });
  }

  // --- 分頁切換 ---
  tabItems.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var targetTab = this.getAttribute('data-tab');

      // 切換標籤 active 狀態
      tabItems.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      // 切換分頁內容
      Object.keys(tabContents).forEach(function (key) {
        if (tabContents[key]) {
          tabContents[key].classList.remove('active');
        }
      });
      if (tabContents[targetTab]) {
        tabContents[targetTab].classList.add('active');
      }
    });
  });

  // ============================================
  // 合約文件滾動 - 自訂捲軸同步
  // ============================================
  var docScroll = document.querySelector('.contract-document-scroll');
  var scrollTrack = document.querySelector('.scroll-track');
  var scrollThumb = document.getElementById('scrollThumb');

  function updateScrollThumb() {
    if (!docScroll || !scrollTrack || !scrollThumb) return;
    var scrollHeight = docScroll.scrollHeight;
    var clientHeight = docScroll.clientHeight;
    var trackHeight = scrollTrack.clientHeight;

    if (scrollHeight <= clientHeight) {
      scrollThumb.style.display = 'none';
      return;
    }

    scrollThumb.style.display = 'block';
    var thumbHeight = Math.max(40, (clientHeight / scrollHeight) * trackHeight);
    var scrollRatio = docScroll.scrollTop / (scrollHeight - clientHeight);
    var thumbTop = scrollRatio * (trackHeight - thumbHeight);

    scrollThumb.style.height = thumbHeight + 'px';
    scrollThumb.style.top = thumbTop + 'px';
  }

  if (docScroll) {
    docScroll.addEventListener('scroll', updateScrollThumb);
    // 初始化捲軸
    setTimeout(updateScrollThumb, 100);
  }

  // ============================================
  // 簽名功能（使用共用元件）
  // ============================================
  SignaturePadComponent.init({
    mountId: 'signatureMount',
    mode: 'inline',
    showSignedSection: true,
    onConfirm: function (dataUrl) {
      // 切換為已簽署狀態
      contractSigned = true;
      updateContractState();
      console.log('簽名已確認');
    }
  });

});
