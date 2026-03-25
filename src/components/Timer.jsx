import React from 'react';
import './Timer.css';

const Timer = ({ minutes, seconds, progress }) => {
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
        <div className="timer-container">
            <svg className="progress-ring" width="300" height="300">
                <circle
                    className="progress-ring-bg"
                    cx="150"
                    cy="150"
                    r="140"
                />
                <circle
                    className="progress-ring-circle"
                    cx="150"
                    cy="150"
                    r="140"
                    style={{
                        strokeDashoffset: 880 - (880 * progress) / 100,
                    }}
                />
            </svg>
            <div className="timer-display">
                <h1 className="time">{formattedTime}</h1>
            </div>
        </div>
    );
};

export default Timer;
