# Electron 桌面應用使用說明 / Electron Desktop App Guide

## 🚀 快速開始 / Quick Start

### 開發模式（測試）/ Development Mode (Testing)
```bash
# 方式 1: 使用腳本 / Method 1: Using Script
雙擊執行 啟動桌面應用.bat

# 方式 2: 命令行 / Method 2: Command Line
npm run electron:dev
```

開發模式會：
- 啟動 Vite 開發伺服器
- 自動開啟 Electron 視窗
- 支援熱重載（修改代碼自動更新）

---

### 生產構建（打包 .exe）/ Production Build (Package .exe)
```bash
# 方式 1: 使用腳本 / Method 1: Using Script
雙擊執行 構建桌面應用.bat

# 方式 2: 命令行 / Method 2: Command Line
npm run electron:build:win
```

構建完成後會生成：
- **安裝程式 / Installer**: `release\Serene Pomodoro Setup 1.0.0.exe`
- **便攜版 / Portable**: `release\Serene Pomodoro 1.0.0.exe`

---

## 📦 安裝方式 / Installation Methods

### 方式 A：使用安裝程式 / Method A: Using Installer
1. 雙擊 `Serene Pomodoro Setup 1.0.0.exe`
2. 選擇安裝位置
3. 安裝完成後在開始菜單找到「Serene Pomodoro」
4. 桌面會自動創建快捷方式

**優點 / Benefits:**
- ✅ 自動創建開始菜單項目
- ✅ 自動創建桌面快捷方式
- ✅ 可以在設定中卸載
- ✅ 更新時可以覆蓋安裝

### 方式 B：使用便攜版 / Method B: Using Portable
1. 將 `Serene Pomodoro 1.0.0.exe` 移動到你想要的資料夾
2. 雙擊執行即可

**優點 / Benefits:**
- ✅ 無需安裝
- ✅ 可以放在 USB 隨身碟
- ✅ 不會寫入系統註冊表
- ✅ 刪除即卸載

---

## 🎨 設定應用圖示 / Setting App Icon

### 為構建添加圖示 / Adding Icon for Build

1. **準備圖示 / Prepare Icon**
   - 從 IconScout/Flaticon 下載番茄圖示
   - 轉換為 .ico 格式（使用 convertio.co/png-ico）
   - 命名為 `icon.ico`
   - 放在 `electron/` 資料夾

2. **取消註解圖示代碼 / Uncomment Icon Code**
   
   在 `electron/main.cjs` 中找到並取消註解：
   ```javascript
   // 這一行，移除註解標記 //
   icon: path.join(__dirname, 'icon.ico'),
   ```

3. **重新構建 / Rebuild**
   ```bash
   npm run electron:build:win
   ```

---

## 🔧 檔案大小與優化 / File Size & Optimization

### 預期檔案大小 / Expected File Sizes
- **安裝程式 / Installer**: ~100-150 MB
- **便攜版 / Portable**: ~120-180 MB
- **安裝後大小 / Installed Size**: ~200-250 MB

### 為什麼這麼大？/ Why So Large?
Electron 應用包含完整的 Chromium 瀏覽器引擎和 Node.js runtime。這是所有 Electron 應用的特性（VS Code, Discord, Notion 等都一樣）。

### 優化建議 / Optimization Tips
如果需要減小檔案大小，可以考慮：
- 使用 7-Zip 壓縮便攜版
- 只構建必要的架構（目前只構建 x64）
- 移除不必要的依賴

---

## 🎯 特色功能 / Features in Desktop App

### vs 瀏覽器版本 / vs Browser Version

| 特色 / Feature | 桌面版 / Desktop | 瀏覽器版 / Browser |
|---|---|---|
| 獨立視窗 | ✅ | ❌ |
| 工作列圖示 | ✅ | ❌ |
| 開機啟動 | ✅ (可設定) | ❌ |
| 離線運行 | ✅ | ❌ |
| 原生通知 | ✅ 更可靠 | ⚠️ 需權限 |
| 系統整合 | ✅ | ❌ |

---

## ❓ 常見問題 / FAQ

### Q: 安裝後在哪裡找到應用？
**A:** 
- 開始菜單 → 搜尋「Serene Pomodoro」
- 或桌面快捷方式

### Q: 如何卸載？
**A:**
- **安裝版**: 設定 → 應用程式 → 找到 Serene Pomodoro → 卸載
- **便攜版**: 直接刪除 .exe 檔案

### Q: 可以同時運行多個實例嗎？
**A:** 可以，但通常不需要。每個實例會是獨立的視窗。

### Q: 構建失敗怎麼辦？
**A:**
1. 確保已安裝所有依賴：`npm install`
2. 確保已執行過：`npm run build`
3. 檢查是否有防毒軟體阻擋
4. 查看錯誤訊息並搜尋解決方案

### Q: 如何更新應用？
**A:**
- 下載新版本的安裝程式
- 重新安裝（會自動覆蓋舊版本）
- 或：手動刪除舊版本後安裝新版本

---

## 📁 相關檔案 / Related Files

```
serene-pomodoro/
├── electron/
│   ├── main.cjs          # Electron 主進程
│   ├── preload.cjs       # 預載腳本
│   └── icon.ico          # 應用圖示（需自行添加）
├── 啟動桌面應用.bat      # 開發模式啟動器
├── 構建桌面應用.bat      # 打包腳本
└── release/              # 構建輸出
    ├── Serene Pomodoro Setup 1.0.0.exe
    └── Serene Pomodoro 1.0.0.exe
```

---

## 💡 進階設定 / Advanced Settings

### 修改視窗大小 / Modify Window Size
編輯 `electron/main.cjs`:
```javascript
width: 1000,     // 視窗寬度
height: 700,     // 視窗高度
minWidth: 800,   // 最小寬度
minHeight: 600,  // 最小高度
```

### 開啟開發者工具 / Enable DevTools
編輯 `electron/main.cjs`，取消註解：
```javascript
mainWindow.webContents.openDevTools();
```

### 修改應用名稱 / Change App Name
編輯 `package.json`:
```json
"build": {
  "productName": "你的應用名稱",
  ...
}
```

---

**享受你的獨立桌面應用！** 🍅✨  
**Enjoy your standalone desktop app!** 🍅✨
