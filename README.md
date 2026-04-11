# 🌿 Serene Pomodoro (靜謐番茄鐘)

一個為平靜而生、具有 iOS 美學設計的懸浮式番茄鐘應用程式。

![App Screenshot](https://via.placeholder.com/340x480.png?text=Serene+Pomodoro+iOS+Widget)

## ✨ 特色功能

### 1. 📱 iOS 懸浮小工具美學
- **無邊框玻璃設計**：採用強力的毛玻璃特效 (`backdrop-filter`) 與透明邊界，呈現極致的視覺質感。
- **自由漂浮固定**：視窗永遠置頂 (`Always-On-Top`)，你可以拖曳視窗任何空白處將它放置在螢幕最適合的地點。
- **精簡介面**：340x480 的精確尺寸，不干擾你工作的同時隨時提醒進度。

### 2. 🌱 靜謐成就花園 (Zen Garden)
- **視覺化專注紀錄**：每完成一個 25 分鐘的 Focus Session，底部的花園就會長出一株小植物 `🌱`。
- **每日自動重置**：每天都是新的開始，看著今天種下的森林，感受滿滿的成就感。

### 3. 🌬️ 4-7-8 放鬆呼吸引導
- **科學化放鬆**：在 5 分鐘休息結束的覆蓋視窗中，加入了精確的「吸氣 4s > 憋氣 7s > 吐氣 8s」動態引導循環。
- **全視窗覆蓋**：時間到時，強制全螢幕置頂並要求手動關閉，確保你真正停下來呼吸 3 秒。

### 4. ⬇️ 系統列隱藏模式 (Tray Mode)
- **極致平靜**：點擊隱藏按鈕可完全縮小至右下角系統列，不佔用任務欄空間。
- **快速喚醒**：點擊系統列小番茄圖示即可瞬間恢復視窗。

---

## 🚀 如何下載與安裝 (給一般使用者)

你可以直接前往本專案的 **[Releases 頁面](https://github.com/zephyus/serene-pomodoro/releases)** 下載最新版的安裝檔，**完全不需要寫程式就能使用！**

### 🍎 Mac 用戶安裝指南
1. 進入 Releases 頁面，找到並下載副檔名為 `.dmg` 的檔案（例如 `Serene-Pomodoro-2.0.0-mac.dmg`）。
2. 雙擊打開下載的 `.dmg` 檔案，將「Serene Pomodoro」的番茄圖示 **拖曳** 到旁邊的 `Applications` (應用程式) 資料夾中。
3. **⚠️ 首次開啟注意（非常重要）：**
   因為這是一款免費且未付費給蘋果進行「官方數位簽章」的獨立軟體，Mac 預設會阻擋開啟並顯示「無法打開，因為它來自未識別的開發者」。
   👉 **解決方法：** 請打開 Mac 的 **「系統設定」 > 「隱私權與安全性」**，往下滑找到這段警告，點擊旁邊的 **「強制打開 (Open Anyway)」** 即可順利使用！

### 🪟 Windows 用戶安裝指南
1. 進入 Releases 頁面，找到並下載副檔名為 `.exe` 的檔案。
2. 這裡提供兩種版本，任選一種下載即可：
   - **免安裝版** (`Serene Pomodoro 2.0.0.exe`)：放在桌面雙擊就能直接用，適合不想安裝軟體的人。
   - **安裝版** (`Serene Pomodoro Setup 2.0.0.exe`)：雙擊執行後會自動安裝，並在你的開始選單和桌面建立永久的捷徑。
3. **⚠️ 首次開啟注意：** 
   有時候 Windows 內建的 Defender 也會跳出藍色畫面警告「Windows 已保護您的電腦」。
   👉 **解決方法：** 點擊提示文字上的 **「其他資訊 (More info)」**，然後點擊 **「仍要執行 (Run anyway)」** 即可。

---

## 🛠️ 開發與編譯環境

如果你想自行修改或在 Mac 上編譯：

### 1. 安裝環境
確保你已安裝 [Node.js](https://nodejs.org/)。

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run electron:dev
```

### 2. 打包程式 (Build)
本專案支援 Windows 與 macOS 的打包：

```bash
# 打包 Windows 版本
npm run electron:build:win

# 打包 macOS 版本 (需在 Mac 上執行)
npm run electron:build:mac
```

---

## 📄 授權協議
MIT License - 隨意使用、隨意分享、隨意平靜。

---
*Created with ❤️ for a more serene workflow.*
