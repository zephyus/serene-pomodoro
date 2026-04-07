const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlayAPI', {
    closeOverlay: () => {
        return ipcRenderer.invoke('close-overlay');
    },
    sendAction: (action) => {
        return ipcRenderer.invoke('overlay-action', action);
    }
});
