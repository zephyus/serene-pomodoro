import React from 'react';
import './Controls.css';

const Controls = ({ isActive, onStart, onPause, onReset, mode, onModeChange }) => {
    return (
        <div className="controls-container">
            <div className="mode-selector">
                <button
                    className={`mode-btn ${mode === 'focus' ? 'active' : ''}`}
                    onClick={() => onModeChange('focus')}
                >
                    Focus
                </button>
                <button
                    className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
                    onClick={() => onModeChange('shortBreak')}
                >
                    Short Break
                </button>
                <button
                    className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
                    onClick={() => onModeChange('longBreak')}
                >
                    Long Break
                </button>
            </div>

            <div className="action-buttons">
                {!isActive ? (
                    <button className="control-btn start-btn" onClick={onStart}>
                        Start
                    </button>
                ) : (
                    <button className="control-btn pause-btn" onClick={onPause}>
                        Pause
                    </button>
                )}
                <button className="control-btn reset-btn" onClick={onReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Controls;
