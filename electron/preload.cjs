const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API 給渲染進程
contextBridge.exposeInMainWorld('electronAPI', {
    // 顯示全螢幕覆蓋通知
    showOverlay: (mode, skipCount = 0) => {
        return ipcRenderer.invoke('show-overlay', { mode, skipCount });
    },

    // 顯示 20-20-20 護眼提醒
    showEyeReminder: () => {
        return ipcRenderer.invoke('show-eye-reminder');
    },

    // 隱藏主視窗至系統列
    hideWindow: () => {
        return ipcRenderer.invoke('hide-window');
    },

    // 監聽來自 Overlay 的動作
    onOverlayAction: (callback) => {
        ipcRenderer.on('overlay-action', (event, action) => callback(action));
    },

    // 檢查是否在 Electron 環境中
    isElectron: true,
});
