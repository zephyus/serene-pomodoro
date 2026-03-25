const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
    closeOverlay: () => {
        return ipcRenderer.invoke('close-overlay');
    },
});
