import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerNotification } from '../utils/notifications';

const useTimer = (customDurations) => {
    // Compute duration map from settings (convert minutes to ms)
    const getDurations = (d) => ({
        focus:      (d?.focusDuration      ?? 25) * 60 * 1000,
        shortBreak: (d?.shortBreakDuration ??  5) * 60 * 1000,
        longBreak:  (d?.longBreakDuration  ?? 15) * 60 * 1000,
    });

    const [mode, setMode] = useState('focus');
    const [isActive, setIsActive] = useState(false);
    const [remainingMs, setRemainingMs] = useState(() => getDurations(customDurations).focus);

    // Refs for accurate time tracking
    const startTimeRef = useRef(null);
    const remainingAtStartRef = useRef(remainingMs);
    const intervalRef = useRef(null);
    const modeRef = useRef(mode);
    const durationsRef = useRef(getDurations(customDurations));
    
    // We use a separate ref to track the CURRENT remainingMs so effects can access it reliably
    const remRef = useRef(remainingMs);
    useEffect(() => {
        remRef.current = remainingMs;
    }, [remainingMs]);

    // Keep mode ref in sync
    useEffect(() => { modeRef.current = mode; }, [mode]);

    // Handle Setting Profile Duration Updates
    useEffect(() => {
        const oldDurations = durationsRef.current;
        const newDurations = getDurations(customDurations);
        durationsRef.current = newDurations;
        
        // Always read the freshly synced latest remainingMs
        const currentRem = remRef.current;

        // Did the slider for the CURRENT mode just get dragged?
        if (oldDurations[mode] !== newDurations[mode]) {
            if (!isActive) {
                // If paused, just snap to the new total duration so they can immediately reflect their target
                setRemainingMs(newDurations[mode]);
            } else if (currentRem > newDurations[mode]) {
                // If running but they shrunk it below what's currently remaining, cap it immediately
                setRemainingMs(newDurations[mode]);
                // Re-sync the base elapsed calculation immediately so no jumps happen
                startTimeRef.current = Date.now();
                remainingAtStartRef.current = newDurations[mode];
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customDurations?.focusDuration, customDurations?.shortBreakDuration, customDurations?.longBreakDuration]);

    // Core timer loop — real-clock based to avoid drift
    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now();
            remainingAtStartRef.current = remainingMs;

            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const newRemaining = remainingAtStartRef.current - elapsed;

                if (newRemaining <= 0) {
                    clearInterval(intervalRef.current);
                    setRemainingMs(0);
                    setIsActive(false);

                    if (modeRef.current === 'focus') {
                        const today = new Date().toISOString().split('T')[0];
                        const statsStr = localStorage.getItem('zen-garden-stats');
                        const stats = statsStr ? JSON.parse(statsStr) : {};
                        stats[today] = (stats[today] || 0) + 1;
                        localStorage.setItem('zen-garden-stats', JSON.stringify(stats));
                        window.dispatchEvent(new Event('zen-garden-updated'));
                    }

                    triggerNotification(modeRef.current);
                } else {
                    setRemainingMs(newRemaining);
                }
            }, 250);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    const totalDuration = durationsRef.current[mode];
    // Clamp progress between 0 and 100 for safety under heavy rendering
    const progress = Math.min(100, Math.max(0, ((totalDuration - remainingMs) / totalDuration) * 100));

    const startTimer  = useCallback(() => setIsActive(true), []);
    const pauseTimer  = useCallback(() => setIsActive(false), []);
    const resetTimer  = useCallback(() => {
        setIsActive(false);
        setRemainingMs(durationsRef.current[mode]);
    }, [mode]);

    const changeMode = useCallback((newMode) => {
        setMode(newMode);
        setIsActive(false);
        setRemainingMs(durationsRef.current[newMode]);
    }, []);

    return { minutes, seconds, isActive, mode, progress, startTimer, pauseTimer, resetTimer, changeMode };
};

export default useTimer;
