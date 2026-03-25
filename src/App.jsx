import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import useTimer from './hooks/useTimer';
import './App.css';

function App() {
  const {
    minutes,
    seconds,
    isActive,
    mode,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
  } = useTimer();

  const [todayFocusCount, setTodayFocusCount] = useState(0);

  // Load Zen Garden stats
  const loadStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const statsStr = localStorage.getItem('zen-garden-stats');
    if (statsStr) {
      const stats = JSON.parse(statsStr);
      setTodayFocusCount(stats[today] || 0);
    }
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('zen-garden-updated', loadStats);
    return () => window.removeEventListener('zen-garden-updated', loadStats);
  }, []);

  const handleHideToTray = () => {
    if (window.electronAPI && window.electronAPI.hideWindow) {
      window.electronAPI.hideWindow();
    }
  };

  return (
    <div className="app">
      {/* Hide to Tray Button */}
      {window.electronAPI?.isElectron && (
        <button 
          className="tray-hide-btn" 
          onClick={handleHideToTray}
          title="隱藏至系統列 (Hide to Tray)"
        >
          ⬇️
        </button>
      )}

      <div className="app-content">
        <h1 className="app-title">Serene Pomodoro</h1>
        <Timer minutes={minutes} seconds={seconds} progress={progress} />
        <Controls
          isActive={isActive}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          mode={mode}
          onModeChange={changeMode}
        />
        
        {/* Zen Garden */}
        <div className="zen-garden">
          <div className="zen-garden-title">今日靜謐花園</div>
          <div className="zen-garden-plants" title={`今天已完成 ${todayFocusCount} 次專注`}>
            {todayFocusCount === 0 ? (
              <span className="zen-empty">尚未種下第一棵樹...</span>
            ) : (
              Array.from({ length: todayFocusCount }).map((_, i) => (
                <span key={i} className="zen-plant">🌱</span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
