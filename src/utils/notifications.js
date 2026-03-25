// Notification utility functions

// Check if running in Electron
const isElectron = window.electronAPI?.isElectron || false;

// Combined notification handler - triggers overlay in Electron, silent browser notification otherwise
export const triggerNotification = (mode) => {
    if (isElectron && window.electronAPI?.showOverlay) {
        // Show fullscreen always-on-top overlay
        window.electronAPI.showOverlay(mode);
        return;
    }

    // Fallback: browser notification (silent)
    if ('Notification' in window && Notification.permission === 'granted') {
        const messages = {
            focus: { title: '✨ 專注時間結束', body: '做得很好！休息一下吧。' },
            shortBreak: { title: '☕ 短休息結束', body: '準備好再次專注了嗎？' },
            longBreak: { title: '🌟 長休息結束', body: '精神飽滿，繼續前進！' }
        };
        const msg = messages[mode] || messages.focus;
        new Notification(msg.title, {
            body: msg.body,
            icon: '/vite.svg',
            tag: 'pomodoro-timer',
            requireInteraction: true,
            silent: true
        });
    }
};

// Request notification permission (for browser fallback)
export const requestNotificationPermission = async () => {
    if (isElectron) return true;
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
};
