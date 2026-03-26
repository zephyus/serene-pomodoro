import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import Settings from './components/Settings';
import AmbientPlayer from './components/AmbientPlayer';
import useTimer from './hooks/useTimer';
import useSettings from './hooks/useSettings';
import './App.css';

import bgFocus  from './assets/bg-focus.png';
import bgBreak  from './assets/bg-break.png';
import bgLong   from './assets/bg-overlay.png'; // Night/Cosmos for Long Break

const AMBIENT_LABELS = {
  none:   '🔇',
  rain:   '🌧',
  forest: '🌲',
  cafe:   '☕',
};

function App() {
  const { settings, updateSetting } = useSettings();

  const {
    minutes, seconds, isActive, mode, progress,
    startTimer, pauseTimer, resetTimer, changeMode,
  } = useTimer(settings);

  const [todayFocusCount, setTodayFocusCount] = useState(0);

  /* ── Stats ── */
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
    if (window.electronAPI?.hideWindow) window.electronAPI.hideWindow();
  };

  // Convert focus count to minimalist dots (groups of 4)
  const renderDots = () => {
    // Show total slots rounded up to nearest 4, min 4
    const totalSlots = Math.max(4, Math.ceil(todayFocusCount / 4) * 4);
    return Array.from({ length: totalSlots }).map((_, i) => (
      <div 
        key={i} 
        className={`progress-dot ${i < todayFocusCount ? 'completed' : ''}`} 
        title={i < todayFocusCount ? '已完成的專注' : '尚未完成'}
      />
    ));
  };

  return (
    <div className="app" data-mode={mode}>
      {/* ── AI Background Layers (crossfade) ── */}
      <div
        className="app-bg app-bg-focus"
        style={{ backgroundImage: `url(${bgFocus})` }}
      />
      <div
        className="app-bg app-bg-break"
        style={{ backgroundImage: `url(${bgBreak})` }}
      />
      <div
        className="app-bg app-bg-long"
        style={{ backgroundImage: `url(${bgLong})` }}
      />

      {/* ── Ambient Audio ── */}
      <AmbientPlayer sound={settings.ambientSound} />

      {/* ── Minimalist Content Layer ── */}
      <div className="app-content">
        
        {/* Title Bar */}
        <div className="title-bar">
          <Settings settings={settings} onUpdate={updateSetting} />
          <p className="app-title">{settings.taskName || 'SERENE POMODORO'}</p>
          {window.electronAPI?.isElectron ? (
            <button
              className="tray-hide-btn"
              onClick={handleHideToTray}
              title="隱藏至系統列"
            >
              ⬇
            </button>
          ) : (
            <div className="tray-placeholder" />
          )}
        </div>

        {/* Center Timer */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
          <Timer
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            mode={mode}
            isActive={isActive}
          />
        </div>

        {/* Bottom Controls */}
        <Controls
          isActive={isActive}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          mode={mode}
          onModeChange={changeMode}
        />

        {/* Ambient Tools */}
        <div className="ambient-bar">
          {Object.entries(AMBIENT_LABELS).map(([sound, label]) => (
            <button
              key={sound}
              className={`ambient-btn${settings.ambientSound === sound ? ' active' : ''}`}
              data-sound={sound}
              onClick={() => updateSetting('ambientSound', sound)}
              title={sound}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="progress-dots-container">
          {renderDots()}
        </div>

      </div>
    </div>
  );
}

export default App;
