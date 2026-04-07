const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');

// 判斷是否為開發模式
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let overlayWindow = null;
let eyeReminderWindow = null;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 340,
        height: 480,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        title: 'Serene Guardian',
        // icon: path.join(__dirname, 'icon.png'),
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // 攔截關閉事件，改為隱藏到系統列
    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// 建立系統列圖示 (Tray)
function createTray() {
    // 使用新複製的 icon.png
    const iconPath = path.join(__dirname, 'icon.png');
    try {
        tray = new Tray(iconPath);
    } catch (e) {
        console.warn('Tray icon not found at', iconPath, e);
    }

    if (tray) {
        tray.setToolTip('Serene Guardian (靜謐守護者)');
        
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '顯示主視窗',
                click: () => mainWindow.show()
            },
            { type: 'separator' },
            {
                label: '完全退出',
                click: () => {
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);
        
        tray.setContextMenu(contextMenu);

        // 左鍵單擊也顯示主視窗
        tray.on('click', () => {
            if (mainWindow) {
                mainWindow.show();
            }
        });
    }
}

// 建立全螢幕置頂覆蓋視窗
function createOverlayWindow(mode, skipCount = 0) {
    if (overlayWindow) {
        overlayWindow.close();
        overlayWindow = null;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    overlayWindow = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        fullscreen: true,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
        resizable: false,
        movable: false,
        minimizable: false,
        closable: true,
        focusable: true,
        webPreferences: {
            preload: path.join(__dirname, 'overlay-preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#0f2027',
    });

    overlayWindow.setAlwaysOnTop(true, 'screen-saver');

    const overlayPath = path.join(__dirname, 'overlay.html');
    overlayWindow.loadFile(overlayPath, {
        query: { mode: mode || 'focus', skipCount: String(skipCount || 0) }
    });

    overlayWindow.on('closed', () => {
        overlayWindow = null;
    });
}

// 建立 20-20-20 護眼提醒小視窗 (角落浮動)
function createEyeReminder() {
    if (eyeReminderWindow) {
        eyeReminderWindow.close();
        eyeReminderWindow = null;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const winWidth = 360;
    const winHeight = 200;
    const margin = 20;

    eyeReminderWindow = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: width - winWidth - margin,
        y: height - winHeight - margin,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        movable: false,
        focusable: false,
        hasShadow: false,
        webPreferences: {
            preload: path.join(__dirname, 'eye-reminder-preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    eyeReminderWindow.setAlwaysOnTop(true, 'floating');

    const reminderPath = path.join(__dirname, 'eye-reminder.html');
    eyeReminderWindow.loadFile(reminderPath);

    eyeReminderWindow.on('closed', () => {
        eyeReminderWindow = null;
    });

    // Auto-close after 25 seconds (20s countdown + buffer)
    setTimeout(() => {
        if (eyeReminderWindow) {
            eyeReminderWindow.close();
            eyeReminderWindow = null;
        }
    }, 25000);
}

// 當 Electron 完成初始化時
app.whenReady().then(() => {
    // 設定開機自動啟動
    if (!isDev) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe'),
        });
    }

    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else if (mainWindow && !mainWindow.isVisible()) {
            mainWindow.show();
        }
    });
});

// 當所有視窗都關閉時
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// -- IPC 處理區 --

ipcMain.handle('show-overlay', (event, { mode, skipCount }) => {
    createOverlayWindow(mode, skipCount);
});

ipcMain.handle('show-eye-reminder', () => {
    createEyeReminder();
});

ipcMain.handle('close-eye-reminder', () => {
    if (eyeReminderWindow) {
        eyeReminderWindow.close();
        eyeReminderWindow = null;
    }
});

ipcMain.handle('close-overlay', () => {
    if (overlayWindow) {
        overlayWindow.close();
        overlayWindow = null;
    }
});

ipcMain.handle('overlay-action', (event, action) => {
    if (mainWindow) {
        mainWindow.webContents.send('overlay-action', action);
    }
});

ipcMain.handle('hide-window', () => {
    if (mainWindow) {
        mainWindow.hide();
    }
});
