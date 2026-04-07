import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerNotification, triggerEyeReminder } from '../utils/notifications';

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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [cycleCount, setCycleCount] = useState(0); // completed focus sessions

    // NEW: Focus-end prompt state.
    // 'none' | 'prompting' | 'resting' | 'waiting'
    const [focusEndState, setFocusEndState] = useState('none');

    // 連續跳過休息次數 (漸進式提醒強度)
    const [skipCount, setSkipCount] = useState(0);
    const skipCountRef = useRef(0);

    // 20-20-20 護眼提醒是否已在本輪觸發
    const eyeReminderTriggeredRef = useRef(false);

    // Refs for accurate time tracking
    const startTimeRef = useRef(null);
    const remainingAtStartRef = useRef(remainingMs);
    const intervalRef = useRef(null);
    const modeRef = useRef(mode);
    const durationsRef = useRef(getDurations(customDurations));
    const transitionTimeoutRef = useRef(null);
    const cycleCountRef = useRef(0);
    const waitTimeoutRef = useRef(null);
    
    // We use a separate ref to track the CURRENT remainingMs so effects can access it reliably
    const remRef = useRef(remainingMs);
    useEffect(() => {
        remRef.current = remainingMs;
    }, [remainingMs]);

    // Keep mode ref in sync
    useEffect(() => { modeRef.current = mode; }, [mode]);
    // Keep cycleCount ref in sync
    useEffect(() => { cycleCountRef.current = cycleCount; }, [cycleCount]);
    // Keep skipCount ref in sync
    useEffect(() => { skipCountRef.current = skipCount; }, [skipCount]);

    // Determine next mode based on current mode and cycle count
    const computeNextMode = useCallback((currentMode, currentCycleCount) => {
        if (currentMode === 'focus') {
            // After every 4th focus session, take a long break
            return (currentCycleCount + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        }
        // After any break, go back to focus
        return 'focus';
    }, []);

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

    // Auto-transition: switch mode and auto-start after a brief pause
    // Used for break→focus transitions (auto) and after rest overlay completes
    const autoTransition = useCallback((fromMode) => {
        setIsTransitioning(true);

        // Clear any existing transition timeout
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        transitionTimeoutRef.current = setTimeout(() => {
            const currentCycle = cycleCountRef.current;
            const nextMode = computeNextMode(fromMode, currentCycle);

            // If we just finished a focus session, increment the cycle count
            if (fromMode === 'focus') {
                setCycleCount(prev => prev + 1);
            }

            setMode(nextMode);
            setRemainingMs(durationsRef.current[nextMode]);
            setIsTransitioning(false);
            setIsActive(true); // Auto-start the next timer
        }, 3000); // 3-second transition buffer
    }, [computeNextMode]);

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

                    const currentMode = modeRef.current;

                    if (currentMode === 'focus') {
                        const today = new Date().toISOString().split('T')[0];
                        const statsStr = localStorage.getItem('zen-garden-stats');
                        const stats = statsStr ? JSON.parse(statsStr) : {};
                        stats[today] = (stats[today] || 0) + 1;
                        localStorage.setItem('zen-garden-stats', JSON.stringify(stats));
                        window.dispatchEvent(new Event('zen-garden-updated'));
                    }

                    triggerNotification(currentMode, skipCountRef.current);

                    // Reset eye reminder flag for next focus cycle
                    eyeReminderTriggeredRef.current = false;

                    // ** NEW LOGIC **
                    // If focus just ended → show prompt instead of auto-transitioning
                    if (currentMode === 'focus') {
                        setFocusEndState('prompting-external'); // Wait for overlay.html action
                    } else {
                        // Break ended → auto-transition back to focus as before
                        autoTransition(currentMode);
                    }
                } else {
                    setRemainingMs(newRemaining);

                    // 20-20-20 護眼提醒：在專注模式剩餘 5 分鐘時觸發 (第 20 分鐘)
                    const currentMode = modeRef.current;
                    if (currentMode === 'focus' && !eyeReminderTriggeredRef.current) {
                        const fiveMinMs = 5 * 60 * 1000;
                        const totalFocus = durationsRef.current.focus;
                        // 只在 focus >= 20 分鐘時觸發，在剩餘 5 分鐘時
                        if (totalFocus >= 20 * 60 * 1000 && newRemaining <= fiveMinMs) {
                            eyeReminderTriggeredRef.current = true;
                            triggerEyeReminder();
                        }
                    }
                }
            }, 250);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
            if (waitTimeoutRef.current) {
                clearTimeout(waitTimeoutRef.current);
            }
        };
    }, []);

    // ── Focus-end prompt handlers ──

    // User chose "開始休息" → show rest overlay
    const handleChooseRest = useCallback(() => {
        setFocusEndState('resting');
        setSkipCount(0); // 選擇休息時重置跳過計數
    }, []);

    // User chose "再等一分鐘" → dismiss, re-prompt after 60s
    const handleChooseWait = useCallback(() => {
        setFocusEndState('waiting');
        setSkipCount(prev => prev + 1); // 記錄跳過次數

        // Clear any existing wait timeout
        if (waitTimeoutRef.current) {
            clearTimeout(waitTimeoutRef.current);
        }

        waitTimeoutRef.current = setTimeout(() => {
            setFocusEndState('prompting');
        }, 60 * 1000); // 1 minute
    }, []);

    // Rest overlay completed (10s elapsed) → transition to break
    const handleRestComplete = useCallback(() => {
        setFocusEndState('none');
        autoTransition('focus');
    }, [autoTransition]);

    // Dismiss focus-end flow (for manual controls)
    const dismissFocusEnd = useCallback(() => {
        setFocusEndState('none');
        if (waitTimeoutRef.current) {
            clearTimeout(waitTimeoutRef.current);
        }
    }, []);

    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    const totalDuration = durationsRef.current[mode];
    // Clamp progress between 0 and 100 for safety under heavy rendering
    const progress = Math.min(100, Math.max(0, ((totalDuration - remainingMs) / totalDuration) * 100));

    const startTimer  = useCallback(() => {
        // Cancel any ongoing transition if user manually starts
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            setIsTransitioning(false);
        }
        // Cancel any focus-end prompt/wait
        dismissFocusEnd();
        setIsActive(true);
    }, [dismissFocusEnd]);

    const pauseTimer  = useCallback(() => {
        // Cancel any ongoing transition if user pauses
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            setIsTransitioning(false);
        }
        setIsActive(false);
    }, []);

    const resetTimer  = useCallback(() => {
        // Cancel any ongoing transition
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            setIsTransitioning(false);
        }
        // Cancel any focus-end prompt/wait
        dismissFocusEnd();
        setIsActive(false);
        setRemainingMs(durationsRef.current[mode]);
    }, [mode, dismissFocusEnd]);

    const changeMode = useCallback((newMode) => {
        // Cancel any ongoing transition
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            setIsTransitioning(false);
        }
        // Cancel any focus-end prompt/wait
        dismissFocusEnd();
        setMode(newMode);
        setIsActive(false);
        setRemainingMs(durationsRef.current[newMode]);
    }, [dismissFocusEnd]);

    return {
        minutes, seconds, isActive, mode, progress,
        startTimer, pauseTimer, resetTimer, changeMode,
        isTransitioning, cycleCount,
        // Focus-end prompt state & handlers
        focusEndState,
        handleChooseRest,
        handleChooseWait,
        handleRestComplete,
        // 漸進式提醒
        skipCount,
    };
};

export default useTimer;
