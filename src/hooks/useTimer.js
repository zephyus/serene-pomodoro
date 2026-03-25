import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerNotification } from '../utils/notifications';
const DURATIONS = {
    focus: 25 * 60 * 1000,
    shortBreak: 5 * 60 * 1000,
    longBreak: 15 * 60 * 1000,
};

const useTimer = () => {
    const [remainingMs, setRemainingMs] = useState(DURATIONS.focus);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'

    // Refs for accurate time tracking
    const startTimeRef = useRef(null);       // Date.now() when timer started/resumed
    const remainingAtStartRef = useRef(DURATIONS.focus); // ms remaining when started/resumed
    const intervalRef = useRef(null);
    const modeRef = useRef(mode);

    // Keep modeRef in sync
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    // Core timer loop — uses real clock to avoid drift
    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now();
            remainingAtStartRef.current = remainingMs;

            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const newRemaining = remainingAtStartRef.current - elapsed;

                if (newRemaining <= 0) {
                    // Timer completed
                    clearInterval(intervalRef.current);
                    setRemainingMs(0);
                    setIsActive(false);

                    // Zen Garden stats updating
                    if (modeRef.current === 'focus') {
                        const today = new Date().toISOString().split('T')[0];
                        const statsStr = localStorage.getItem('zen-garden-stats');
                        const stats = statsStr ? JSON.parse(statsStr) : {};
                        stats[today] = (stats[today] || 0) + 1;
                        localStorage.setItem('zen-garden-stats', JSON.stringify(stats));
                        
                        // Dispatch custom event so App.jsx can update immediately
                        window.dispatchEvent(new Event('zen-garden-updated'));
                    }

                    triggerNotification(modeRef.current);
                } else {
                    setRemainingMs(newRemaining);
                }
            }, 250); // Update 4x per second for smooth display
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    const totalDuration = DURATIONS[mode];
    const progress = ((totalDuration - remainingMs) / totalDuration) * 100;

    const startTimer = useCallback(() => {
        setIsActive(true);
    }, []);

    const pauseTimer = useCallback(() => {
        setIsActive(false);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setRemainingMs(DURATIONS[mode]);
    }, [mode]);

    const changeMode = useCallback((newMode) => {
        setMode(newMode);
        setIsActive(false);
        setRemainingMs(DURATIONS[newMode]);
    }, []);

    return {
        minutes,
        seconds,
        isActive,
        mode,
        progress,
        startTimer,
        pauseTimer,
        resetTimer,
        changeMode,
    };
};

export default useTimer;
