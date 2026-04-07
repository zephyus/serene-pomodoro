const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eyeReminderAPI', {
    close: () => {
        return ipcRenderer.invoke('close-eye-reminder');
    }
});
