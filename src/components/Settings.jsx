import React from 'react';
import './Settings.css';

const Settings = ({ settings, onUpdate }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { focusDuration, shortBreakDuration, longBreakDuration } = settings;

  return (
    <div className="settings-container">
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="設定"
        title="設定"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-title">設定</div>

          <div className="setting-group">
            <div className="setting-label">⏱ 計時時長（分鐘）</div>
            {[
              { key: 'focusDuration',      label: '🍅 專注',   value: focusDuration,      min: 5, max: 60 },
              { key: 'shortBreakDuration', label: '🌿 短休息', value: shortBreakDuration, min: 1, max: 15 },
              { key: 'longBreakDuration',  label: '🌙 長休息', value: longBreakDuration,  min: 5, max: 30 },
            ].map(({ key, label, value, min, max }) => (
              <div className="duration-row" key={key}>
                <span className="duration-name">{label}</span>
                <input
                  type="range"
                  className="duration-slider"
                  min={min} max={max}
                  value={value}
                  onChange={e => onUpdate(key, Number(e.target.value))}
                />
                <span className="duration-value">{value}m</span>
              </div>
            ))}
          </div>

          <div className="setting-info">
            🌌 計時結束時會自動顯示全螢幕放鬆畫面
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
