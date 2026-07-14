/**
 * CRM-line 全站優化批次更新腳本
 * 功能：
 * 1. 為所有 HTML 頁面加入 Loading 遮罩（inline critical CSS + HTML + JS 引用）
 * 2. 為圖片加入 lazy loading（裝飾性背景圖除外）
 * 3. 為 JS 加入 defer 屬性（loading.js 除外）
 * 4. 引入 crm-loading.css
 */

const fs = require('fs');
const path = require('path');

const CRM_DIR = __dirname;

// Loading 遮罩的 inline CSS（放在 <head> 中確保優先渲染）
const INLINE_LOADING_CSS = `
  <!-- Loading 遮罩 inline 樣式（確保最快渲染） -->
  <style>
    .crm-page-loader{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#e8e4df;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;transition:opacity .35s ease,visibility .35s ease}
    .crm-page-loader.is-hidden{opacity:0;visibility:hidden;pointer-events:none}
    .crm-loader-spinner{width:40px;height:40px;border:3px solid rgba(169,158,145,.25);border-top-color:#a99e91;border-radius:50%;animation:crm-spin .7s linear infinite}
    .crm-loader-text{margin-top:16px;font-family:'Noto Sans TC','Microsoft JhengHei',sans-serif;font-size:14px;font-weight:500;color:#6b6560;letter-spacing:1px}
    @keyframes crm-spin{to{transform:rotate(360deg)}}
  </style>`;

// Loading 遮罩 HTML
const LOADING_HTML = `
  <!-- 全頁 Loading 遮罩 -->
  <div class="crm-page-loader" id="crmPageLoader">
    <div class="crm-loader-spinner"></div>
    <p class="crm-loader-text">載入中</p>
  </div>
`;

// Loading JS 引用標籤
const LOADING_JS = `  <script src="js/crm-loading.js"><\/script>`;

// 取得所有 HTML 檔案
const htmlFiles = fs.readdirSync(CRM_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(CRM_DIR, f));

let updatedCount = 0;
let skippedCount = 0;

htmlFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // --- 1. 檢查是否已有 loading 遮罩 ---
  if (content.includes('crmPageLoader')) {
    console.log(`[跳過] ${fileName} — 已有 Loading 遮罩`);
    skippedCount++;
    // 仍然繼續處理其他優化
  }

  // --- 2. 在 </head> 前加入 inline loading CSS ---
  if (!content.includes('crm-page-loader') && content.includes('</head>')) {
    content = content.replace('</head>', INLINE_LOADING_CSS + '\n</head>');
    modified = true;
  }

  // --- 3. 在 <body> 後立即加入 loading HTML ---
  if (!content.includes('crmPageLoader') && content.includes('<body>')) {
    content = content.replace('<body>', '<body>' + LOADING_HTML);
    modified = true;
  }

  // --- 4. 在 </body> 前加入 crm-loading.js（放在所有 script 之後） ---
  if (!content.includes('crm-loading.js') && content.includes('</body>')) {
    content = content.replace('</body>', LOADING_JS + '\n</body>');
    modified = true;
  }

  // --- 5. 為非 loading 的 <script> 加入 defer ---
  // 匹配 <script src="..."> 但排除已有 defer/async 或是 inline script
  const scriptRegex = /<script\s+src="([^"]+)">\s*<\/script>/g;
  content = content.replace(scriptRegex, (match, src) => {
    // 不對 crm-loading.js 加 defer（需同步執行）
    if (src.includes('crm-loading.js')) return match;
    // 已有 defer 則跳過
    if (match.includes('defer')) return match;
    const newTag = `<script src="${src}" defer><\/script>`;
    if (newTag !== match) modified = true;
    return newTag;
  });

  // --- 6. 為圖片加入 lazy loading ---
  // 排除裝飾性背景圖（ellipse-decoration）與小圖示
  const imgRegex = /<img\s([^>]*?)>/g;
  content = content.replace(imgRegex, (match, attrs) => {
    // 已有 loading 屬性則跳過
    if (attrs.includes('loading=')) return match;
    // 裝飾性橢圓背景不做 lazy（首屏需要）
    if (attrs.includes('ellipse-decoration')) return match;
    // header 中的圖示不做 lazy（首屏需要）
    if (attrs.includes('arrow.svg') || attrs.includes('arrow-icon.svg') || attrs.includes('home-icon.svg')) return match;
    // crm-logo 不做 lazy
    if (attrs.includes('crm-logo')) return match;
    
    const newTag = `<img ${attrs} loading="lazy">`;
    if (newTag !== match) modified = true;
    return newTag;
  });

  // --- 7. 寫回檔案 ---
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
    console.log(`[更新] ${fileName}`);
  } else if (!content.includes('crmPageLoader')) {
    console.log(`[未變] ${fileName}`);
  }
});

console.log('\n=== 批次更新完成 ===');
console.log(`已更新：${updatedCount} 個檔案`);
console.log(`已跳過：${skippedCount} 個檔案`);
console.log(`共處理：${htmlFiles.length} 個 HTML 檔案`);
