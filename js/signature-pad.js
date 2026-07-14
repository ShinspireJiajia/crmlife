/**
 * 共用簽名元件 (SignaturePadComponent)
 * 自動產生簽名 HTML 結構，提供全螢幕遮罩簽名（overlay）與行內畫布簽名（inline）兩種模式
 *
 * 使用方式：
 *   // overlay 模式（預設）：頁面只需一個掛載容器
 *   //   <div id="signatureMount"></div>
 *   SignaturePadComponent.init({ mountId: 'signatureMount', storageKey: 'myKey' });
 *
 *   // inline 模式：
 *   //   <div id="signatureMount"></div>
 *   SignaturePadComponent.init({ mountId: 'signatureMount', mode: 'inline', onConfirm: function(dataUrl){ ... } });
 */
var SignaturePadComponent = (function () {
  'use strict';

  // 用於多實例時產生不重複 ID
  var instanceCount = 0;

  // ============================
  // DOM 模板產生
  // ============================

  /**
   * 產生 overlay 模式 HTML 結構
   * @param {string} prefix - 唯一前綴，用於生成不重複的 ID
   * @param {string} title - 簽名標題文字
   * @param {boolean} showInlineButtons - 是否顯示卡片內的清除/確認按鈕
   * @returns {Object} 容器 HTMLElement 與各元素的 ID 對照
   */
  function buildOverlayDOM(prefix, title, showInlineButtons) {
    var html = '' +
      '<!-- 住戶簽名確認 -->' +
      '<div class="signature-section" id="' + prefix + '_section">' +
        '<p class="signature-title">' + title + '</p>' +
        '<div class="signature-area">' +
          '<div class="signature-pad" id="' + prefix + '_pad">' +
            '<p class="signature-placeholder" id="' + prefix + '_placeholder">點擊此處進行簽名</p>' +
            '<img class="signature-result" id="' + prefix + '_result" src="" alt="簽名" style="display:none;">' +
          '</div>' +
          (showInlineButtons
            ? '<div class="signature-actions">' +
                '<button class="btn btn-clear-inline" id="' + prefix + '_inlineClear">清除簽名</button>' +
                '<button class="btn btn-confirm-inline" id="' + prefix + '_inlineConfirm">確認簽名</button>' +
              '</div>'
            : '') +
        '</div>' +
      '</div>' +
      '<!-- 全螢幕橫向簽名遮罩 -->' +
      '<div class="signature-overlay" id="' + prefix + '_overlay">' +
        '<div class="signature-overlay-inner">' +
          '<p class="signature-overlay-title">請在下方區域簽名</p>' +
          '<div class="signature-canvas-wrap">' +
            '<canvas id="' + prefix + '_canvas"></canvas>' +
          '</div>' +
          '<div class="signature-overlay-actions">' +
            '<button class="btn btn-clear" id="' + prefix + '_clearBtn">清除簽名</button>' +
            '<button class="btn btn-sign-confirm" id="' + prefix + '_confirmBtn">確認簽名</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var ids = {
      sectionId: prefix + '_section',
      padId: prefix + '_pad',
      placeholderId: prefix + '_placeholder',
      resultId: prefix + '_result',
      overlayId: prefix + '_overlay',
      canvasId: prefix + '_canvas',
      clearBtnId: prefix + '_clearBtn',
      confirmBtnId: prefix + '_confirmBtn',
      inlineClearBtnId: showInlineButtons ? prefix + '_inlineClear' : '',
      inlineConfirmBtnId: showInlineButtons ? prefix + '_inlineConfirm' : ''
    };

    return { html: html, ids: ids };
  }

  /**
   * 產生 inline 模式 HTML 結構
   * @param {string} prefix - 唯一前綴
   * @param {boolean} showSignedSection - 是否顯示「已簽署」展示區
   * @returns {Object} 容器 HTML 與各元素的 ID 對照
   */
  function buildInlineDOM(prefix, showSignedSection) {
    var html = '' +
      '<!-- 待簽署狀態：簽名區 -->' +
      '<div class="signature-section" id="' + prefix + '_pending">' +
        '<div class="signature-pad" id="' + prefix + '_pad">' +
          '<p class="signature-placeholder" id="' + prefix + '_placeholder">點擊此處進行簽名</p>' +
          '<canvas id="' + prefix + '_canvas"></canvas>' +
        '</div>' +
        '<div class="signature-actions">' +
          '<button class="btn-clear-sign" id="' + prefix + '_clearBtn">清除簽名</button>' +
          '<button class="btn-confirm-sign" id="' + prefix + '_confirmBtn">確認簽名</button>' +
        '</div>' +
      '</div>';

    if (showSignedSection) {
      html += '' +
        '<!-- 已簽署狀態：簽名展示 -->' +
        '<div class="signature-section signed-section" id="' + prefix + '_signed" style="display: none;">' +
          '<div class="signature-display">' +
            '<img class="signature-img" id="' + prefix + '_signedImg" src="" alt="簽名">' +
          '</div>' +
        '</div>';
    }

    var ids = {
      pendingId: prefix + '_pending',
      padId: prefix + '_pad',
      placeholderId: prefix + '_placeholder',
      canvasId: prefix + '_canvas',
      clearBtnId: prefix + '_clearBtn',
      confirmBtnId: prefix + '_confirmBtn',
      signedSectionId: showSignedSection ? prefix + '_signed' : '',
      signedImgId: showSignedSection ? prefix + '_signedImg' : ''
    };

    return { html: html, ids: ids };
  }

  // ============================
  // 主要初始化函式
  // ============================

  /**
   * 初始化簽名元件
   * @param {Object} options - 設定選項
   * @param {string} options.mountId - 掛載容器元素 ID（必填）
   * @param {string} [options.mode='overlay'] - 'overlay'（全螢幕遮罩）或 'inline'（行內畫布）
   * @param {string} [options.title='住戶簽名確認'] - 簽名區標題
   * @param {boolean} [options.showInlineButtons=true] - overlay 模式下是否顯示卡片內清除/確認按鈕
   * @param {boolean} [options.showSignedSection=false] - inline 模式下是否顯示已簽署展示區
   * @param {string} [options.storageKey] - localStorage 儲存鍵名（僅 overlay 模式適用）
   * @param {Function} [options.onConfirm] - 確認簽名後的回呼函式，接收 dataUrl 參數
   * @param {Function} [options.onClear] - 清除簽名後的回呼函式
   * @returns {Object} 簽名元件實例
   */
  function init(options) {
    var opts = Object.assign({
      mountId: 'signatureMount',
      mode: 'overlay',
      title: '住戶簽名確認',
      showInlineButtons: true,
      showSignedSection: false,
      storageKey: '',
      onConfirm: null,
      onClear: null
    }, options || {});

    // 取得掛載點
    var mount = document.getElementById(opts.mountId);
    if (!mount) {
      console.warn('SignaturePadComponent: 找不到掛載元素 #' + opts.mountId);
      return null;
    }

    // 產生唯一前綴
    instanceCount++;
    var prefix = 'sig' + instanceCount;

    // 根據模式產生 DOM
    var built;
    if (opts.mode === 'inline') {
      built = buildInlineDOM(prefix, opts.showSignedSection);
    } else {
      built = buildOverlayDOM(prefix, opts.title, opts.showInlineButtons);
    }

    // 將 HTML 注入掛載點
    mount.innerHTML = built.html;
    var ids = built.ids;

    // 取得 DOM 元素
    var signaturePad = document.getElementById(ids.padId);
    var signaturePlaceholder = document.getElementById(ids.placeholderId);
    var signatureCanvas = document.getElementById(ids.canvasId);
    var btnClearSign = document.getElementById(ids.clearBtnId);
    var btnConfirmSign = document.getElementById(ids.confirmBtnId);

    var ctx = null;
    var isDrawing = false;
    var hasStrokes = false;

    // ============================
    // overlay 模式
    // ============================
    if (opts.mode === 'overlay') {
      var signatureOverlay = document.getElementById(ids.overlayId);
      var signatureResult = document.getElementById(ids.resultId);
      var btnInlineClear = ids.inlineClearBtnId ? document.getElementById(ids.inlineClearBtnId) : null;
      var btnInlineConfirm = ids.inlineConfirmBtnId ? document.getElementById(ids.inlineConfirmBtnId) : null;
      var canvasWrap = signatureCanvas ? signatureCanvas.parentElement : null;

      // 初始化 Canvas 尺寸
      function initCanvas() {
        if (!signatureCanvas || !canvasWrap) return;
        signatureCanvas.width = canvasWrap.offsetWidth;
        signatureCanvas.height = canvasWrap.offsetHeight;
        ctx = signatureCanvas.getContext('2d');
        ctx.strokeStyle = '#3a4246';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        hasStrokes = false;
      }

      // 開啟全螢幕簽名遮罩（強制橫屏，不依賴手機系統旋轉設定）
      function openSignatureOverlay() {
        if (!signatureOverlay) return;
        signatureOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 嘗試進入全螢幕模式 + 鎖定橫向（Android Chrome 支援）
        var el = signatureOverlay;
        var requestFs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (requestFs) {
          requestFs.call(el).then(function () {
            // 全螢幕後嘗試鎖定為橫向
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape').catch(function () { /* 忽略不支援 */ });
            }
          }).catch(function () {
            // 全螢幕失敗（iOS Safari 等），仍靠 CSS transform: rotate(90deg) 強制橫屏
          });
        }

        // 延遲初始化 Canvas，等待全螢幕動畫/CSS 旋轉佈局完成
        setTimeout(initCanvas, 150);
      }

      // 關閉全螢幕簽名遮罩
      function closeSignatureOverlay() {
        if (!signatureOverlay) return;
        signatureOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // 解鎖螢幕方向並退出全螢幕
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
        if (document.fullscreenElement || document.webkitFullscreenElement) {
          var exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
          if (exitFs) exitFs.call(document).catch(function () {});
        }
      }

      // 監聽全螢幕狀態變化（使用者從外部退出全螢幕時同步關閉遮罩）
      function onFullscreenChange() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (signatureOverlay && signatureOverlay.classList.contains('active')) {
            signatureOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (screen.orientation && screen.orientation.unlock) {
              screen.orientation.unlock();
            }
          }
        }
      }
      document.addEventListener('fullscreenchange', onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);

      // 螢幕方向改變時重新初始化畫布尺寸
      window.addEventListener('orientationchange', function () {
        if (signatureOverlay && signatureOverlay.classList.contains('active')) {
          setTimeout(initCanvas, 200);
        }
      });

      // 視窗大小改變時（含全螢幕切換）重新初始化畫布尺寸
      window.addEventListener('resize', function () {
        if (signatureOverlay && signatureOverlay.classList.contains('active')) {
          setTimeout(initCanvas, 120);
        }
      });

      // 取得觸控/滑鼠座標（處理 CSS rotate(90deg) 座標轉換）
      function getPos(e) {
        var touch = e.touches ? e.touches[0] : e;
        var sx = touch.clientX;
        var sy = touch.clientY;
        var rect = signatureCanvas.getBoundingClientRect();
        var isPortrait = window.matchMedia('(orientation: portrait)').matches;

        if (isPortrait) {
          var bcx = rect.left + rect.width / 2;
          var bcy = rect.top + rect.height / 2;
          var ecx = signatureCanvas.width / 2;
          var ecy = signatureCanvas.height / 2;
          var dx = sx - bcx;
          var dy = sy - bcy;
          return { x: ecx + dy, y: ecy - dx };
        } else {
          return {
            x: (sx - rect.left) / rect.width * signatureCanvas.width,
            y: (sy - rect.top) / rect.height * signatureCanvas.height
          };
        }
      }

      // 點擊簽名區域 → 開啟遮罩
      if (signaturePad) {
        signaturePad.addEventListener('click', function () {
          openSignatureOverlay();
        });
      }

      // 卡片內「確認簽名」按鈕 → 開啟遮罩
      if (btnInlineConfirm) {
        btnInlineConfirm.addEventListener('click', function () {
          openSignatureOverlay();
        });
      }

      // 卡片內「清除簽名」按鈕
      if (btnInlineClear) {
        btnInlineClear.addEventListener('click', function () {
          clearSignatureResult();
          if (opts.onClear) opts.onClear();
        });
      }

      // Canvas 繪圖事件
      if (signatureCanvas) {
        signatureCanvas.addEventListener('mousedown', function (e) {
          if (!ctx) return;
          isDrawing = true;
          hasStrokes = true;
          var pos = getPos(e);
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
        });
        signatureCanvas.addEventListener('mousemove', function (e) {
          if (!isDrawing || !ctx) return;
          var pos = getPos(e);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        });
        signatureCanvas.addEventListener('mouseup', function () { isDrawing = false; });
        signatureCanvas.addEventListener('mouseleave', function () { isDrawing = false; });

        signatureCanvas.addEventListener('touchstart', function (e) {
          e.preventDefault();
          if (!ctx) return;
          isDrawing = true;
          hasStrokes = true;
          var pos = getPos(e);
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
        });
        signatureCanvas.addEventListener('touchmove', function (e) {
          e.preventDefault();
          if (!isDrawing || !ctx) return;
          var pos = getPos(e);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        });
        signatureCanvas.addEventListener('touchend', function () { isDrawing = false; });
      }

      // 遮罩內清除簽名
      if (btnClearSign) {
        btnClearSign.addEventListener('click', function () {
          if (ctx && signatureCanvas) {
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            hasStrokes = false;
          }
        });
      }

      // 遮罩內確認簽名
      if (btnConfirmSign) {
        btnConfirmSign.addEventListener('click', function () {
          if (!hasStrokes) {
            alert('請先進行簽名');
            return;
          }
          var dataUrl = signatureCanvas.toDataURL('image/png');
          applySignatureResult(dataUrl);
          // 儲存至 localStorage
          if (opts.storageKey) {
            try {
              localStorage.setItem(opts.storageKey, dataUrl);
            } catch (e) {
              console.warn('簽名儲存失敗', e);
            }
          }
          if (opts.onConfirm) opts.onConfirm(dataUrl);
          closeSignatureOverlay();
        });
      }

      // 頁面載入時恢復已儲存的簽名
      if (opts.storageKey) {
        var saved = null;
        try {
          saved = localStorage.getItem(opts.storageKey);
        } catch (e) { /* 忽略 */ }
        if (saved && signatureResult && signaturePlaceholder && signaturePad) {
          applySignatureResult(saved);
        }
      }

      /** 將簽名圖片套用到預覽區 */
      function applySignatureResult(dataUrl) {
        if (signatureResult) {
          signatureResult.src = dataUrl;
          signatureResult.style.display = 'block';
        }
        if (signaturePlaceholder) {
          signaturePlaceholder.style.display = 'none';
        }
        if (signaturePad) {
          signaturePad.classList.add('has-signature');
        }
      }

      /** 清除預覽區簽名 */
      function clearSignatureResult() {
        if (signatureResult) {
          signatureResult.src = '';
          signatureResult.style.display = 'none';
        }
        if (signaturePlaceholder) {
          signaturePlaceholder.style.display = '';
        }
        if (signaturePad) {
          signaturePad.classList.remove('has-signature');
        }
        if (opts.storageKey) {
          try {
            localStorage.removeItem(opts.storageKey);
          } catch (e) {
            console.warn('簽名清除失敗', e);
          }
        }
      }

      // 公開 API（overlay 模式）
      return {
        clear: clearSignatureResult,
        apply: applySignatureResult,
        open: openSignatureOverlay,
        getDataUrl: function () {
          return signatureCanvas ? signatureCanvas.toDataURL('image/png') : '';
        },
        hasSignature: function () {
          return hasStrokes;
        }
      };
    }

    // ============================
    // inline 模式
    // ============================
    if (opts.mode === 'inline') {
      var pendingSection = document.getElementById(ids.pendingId);
      var signedSection = ids.signedSectionId ? document.getElementById(ids.signedSectionId) : null;
      var signedImg = ids.signedImgId ? document.getElementById(ids.signedImgId) : null;

      // 初始化 Canvas 尺寸
      function initInlineCanvas() {
        if (!signatureCanvas || !signaturePad) return;
        signatureCanvas.width = signaturePad.clientWidth;
        signatureCanvas.height = signaturePad.clientHeight;
        ctx = signatureCanvas.getContext('2d');
        ctx.strokeStyle = '#3a4246';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      // 點擊簽名區域：顯示 Canvas
      if (signaturePad) {
        signaturePad.addEventListener('click', function () {
          if (signatureCanvas.classList.contains('active')) return;
          signatureCanvas.classList.add('active');
          if (signaturePlaceholder) signaturePlaceholder.style.display = 'none';
          initInlineCanvas();
        });
      }

      // 取得座標
      function getInlinePos(e) {
        var rect = signatureCanvas.getBoundingClientRect();
        var touch = e.touches ? e.touches[0] : e;
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      }

      function startDraw(e) {
        if (!ctx) return;
        isDrawing = true;
        hasStrokes = true;
        var pos = getInlinePos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
      }

      function drawing(e) {
        if (!isDrawing || !ctx) return;
        var pos = getInlinePos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
      }

      function endDraw() {
        isDrawing = false;
      }

      if (signatureCanvas) {
        signatureCanvas.addEventListener('mousedown', startDraw);
        signatureCanvas.addEventListener('mousemove', drawing);
        signatureCanvas.addEventListener('mouseup', endDraw);
        signatureCanvas.addEventListener('mouseleave', endDraw);
        signatureCanvas.addEventListener('touchstart', startDraw);
        signatureCanvas.addEventListener('touchmove', drawing);
        signatureCanvas.addEventListener('touchend', endDraw);
      }

      // 清除簽名
      if (btnClearSign) {
        btnClearSign.addEventListener('click', function () {
          if (!ctx) return;
          ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
          hasStrokes = false;
          if (opts.onClear) opts.onClear();
        });
      }

      // 確認簽名
      if (btnConfirmSign) {
        btnConfirmSign.addEventListener('click', function () {
          if (!ctx) return;
          // 檢查畫布是否為空
          var imageData = ctx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
          var hasSignature = false;
          for (var i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] > 0) {
              hasSignature = true;
              break;
            }
          }
          if (!hasSignature) {
            alert('請先進行簽名');
            return;
          }
          var dataUrl = signatureCanvas.toDataURL('image/png');
          // 切換到已簽署展示區
          if (signedSection && signedImg) {
            signedImg.src = dataUrl;
            if (pendingSection) pendingSection.style.display = 'none';
            signedSection.style.display = '';
          }
          if (opts.onConfirm) opts.onConfirm(dataUrl);
        });
      }

      // 公開 API（inline 模式）
      return {
        clear: function () {
          if (ctx) {
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
            hasStrokes = false;
          }
          // 切回待簽署狀態
          if (signedSection) signedSection.style.display = 'none';
          if (pendingSection) pendingSection.style.display = '';
        },
        getDataUrl: function () {
          return signatureCanvas ? signatureCanvas.toDataURL('image/png') : '';
        },
        hasSignature: function () {
          return hasStrokes;
        }
      };
    }
  }

  return { init: init };
})();
