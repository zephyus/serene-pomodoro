const { contextBridge, ipcRenderer } = require('electron');

// Store the wrapped listener so we can remove it later
let overlayActionListener = null;

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
        // Remove previous listener if any, to prevent accumulation
        if (overlayActionListener) {
            ipcRenderer.removeListener('overlay-action', overlayActionListener);
        }
        overlayActionListener = (event, action) => callback(action);
        ipcRenderer.on('overlay-action', overlayActionListener);
    },

    // 移除 Overlay 動作監聽器
    removeOverlayAction: () => {
        if (overlayActionListener) {
            ipcRenderer.removeListener('overlay-action', overlayActionListener);
            overlayActionListener = null;
        }
    },

    // 檢查是否在 Electron 環境中
    isElectron: true,
});

