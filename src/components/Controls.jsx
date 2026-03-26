import React from 'react';
import './Controls.css';

const MODE_CONFIG = {
  focus:      { label: '專 注', mode: 'focus' },
  shortBreak: { label: '短 休 息', mode: 'shortBreak' },
  longBreak:  { label: '長 休 息', mode: 'longBreak' },
};

const Controls = ({ isActive, onStart, onPause, onReset, mode, onModeChange }) => {
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
            >
              {label}
            </button>
            {i < 2 && <span className="mode-separator">·</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Transparent Pill Action Buttons ── */}
      <div className="action-buttons" data-mode={mode}>
        {!isActive ? (
          <button className="control-btn main-action-btn start-btn" onClick={onStart}>
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
