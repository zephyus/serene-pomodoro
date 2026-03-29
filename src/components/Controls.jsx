import React from 'react';
import './Controls.css';

const MODE_CONFIG = {
  focus:      { label: '專 注', mode: 'focus' },
  shortBreak: { label: '短 休 息', mode: 'shortBreak' },
  longBreak:  { label: '長 休 息', mode: 'longBreak' },
};

const Controls = ({ isActive, onStart, onPause, onReset, mode, onModeChange, cycleCount = 0, isTransitioning = false }) => {
  // Current cycle position within the 4-cycle set (1-based)
  const cyclePosition = (cycleCount % 4) + 1;

  return (
    <div className="controls-container" data-mode={mode}>
      {/* ── Text-based Mode Selection ── */}
      <div className="mode-selector">
        {Object.values(MODE_CONFIG).map(({ label, mode: m }, i) => (
          <React.Fragment key={m}>
            <button
              className={`mode-btn${mode === m ? ' active' : ''}`}
              data-mode={m}
              onClick={() => onModeChange(m)}
              disabled={isTransitioning}
            >
              {label}
            </button>
            {i < 2 && <span className="mode-separator">·</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Cycle Counter ── */}
      <div className="cycle-indicator">
        {[1, 2, 3, 4].map(n => (
          <span
            key={n}
            className={`cycle-dot ${n <= cyclePosition ? 'cycle-active' : ''} ${n === cyclePosition && mode === 'focus' ? 'cycle-current' : ''}`}
          />
        ))}
        <span className="cycle-label">第 {cyclePosition}/4 輪</span>
      </div>

      {/* ── Transparent Pill Action Buttons ── */}
      <div className="action-buttons" data-mode={mode}>
        {!isActive ? (
          <button
            className="control-btn main-action-btn start-btn"
            onClick={onStart}
            disabled={isTransitioning}
          >
            ▶ 開 始
          </button>
        ) : (
          <button className="control-btn main-action-btn pause-btn" onClick={onPause}>
            ⏸ 暫 停
          </button>
        )}
        <button className="control-btn reset-btn" onClick={onReset} title="重置">
          ↺
        </button>
      </div>
    </div>
  );
};

export default Controls;
