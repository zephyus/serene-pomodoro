import React, { useState, useEffect, useRef } from 'react';
import './RestOverlay.css';

const REST_QUOTES = [
  { text: 'Rest is not idleness.', author: 'John Lubbock' },
  { text: '站起來，喝杯水。', author: '你的身體' },
  { text: 'Look away from the screen. Let your eyes relax.', author: '護眼提醒' },
  { text: '深呼吸，感受此刻。', author: '正念練習' },
  { text: 'Stretch your shoulders and neck.', author: '健康習慣' },
];

/**
 * RestOverlay – Forced fullscreen takeover for 10 seconds.
 * Shows a calming rest screen with a countdown.
 */
const RestOverlay = ({ visible, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [quote] = useState(() =>
    REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)]
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setSecondsLeft(10);

      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      setSecondsLeft(10);
    }

    return () => clearInterval(intervalRef.current);
  }, [visible, onComplete]);

  if (!visible) return null;

  const progress = ((10 - secondsLeft) / 10) * 100;

  return (
    <div className="rest-overlay">
      {/* Animated breathing background */}
      <div className="rest-breathing-circle" />

      <div className="rest-content">
        {/* Main rest icon */}
        <div className="rest-main-icon">🌿</div>

        <h2 className="rest-title">休息一下</h2>

        {/* Quote */}
        <div className="rest-quote">
          <p className="rest-quote-text">"{quote.text}"</p>
          <p className="rest-quote-author">— {quote.author}</p>
        </div>

        {/* Progress bar */}
        <div className="rest-progress-container">
          <div
            className="rest-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="rest-countdown-text">
          {secondsLeft > 0 ? `${secondsLeft} 秒後自動繼續` : '準備開始...'}
        </p>
      </div>
    </div>
  );
};

export default RestOverlay;
