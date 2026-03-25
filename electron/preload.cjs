const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API 給渲染進程
contextBridge.exposeInMainWorld('electronAPI', {
    // 顯示全螢幕覆蓋通知
    showOverlay: (mode) => {
        return ipcRenderer.invoke('show-overlay', { mode });
    },

    // 隱藏主視窗至系統列
    hideWindow: () => {
        return ipcRenderer.invoke('hide-window');
    },

    // 檢查是否在 Electron 環境中
    isElectron: true,
});
