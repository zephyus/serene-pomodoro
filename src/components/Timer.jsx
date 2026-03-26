import React from 'react';
import './Timer.css';

// SVG params: r=110, circumference = 2π×110 ≈ 691.15
const RADIUS = 110;
const CIRC = 2 * Math.PI * RADIUS;

const Timer = ({ minutes, seconds, progress, mode, isActive }) => {
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const offset = CIRC - (CIRC * progress) / 100;

  return (
    <div
      className="timer-container"
      data-mode={mode}
      data-active={String(isActive)}
    >
      <svg
        className="progress-ring"
        width="240"
        height="240"
        viewBox="0 0 240 240"
      >
        <circle
          className="progress-ring-bg"
          cx="120" cy="120" r={RADIUS}
        />
        <circle
          className="progress-ring-glow"
          cx="120" cy="120" r={RADIUS}
          style={{ strokeDashoffset: offset }}
        />
        <circle
          className="progress-ring-circle"
          cx="120" cy="120" r={RADIUS}
          style={{ strokeDashoffset: offset }}
        />
      </svg>

      <div className="timer-display">
        <div className="time">{formattedTime}</div>
      </div>
    </div>
  );
};

export default Timer;
