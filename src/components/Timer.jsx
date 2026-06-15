import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

// SVG params: r=110, circumference = 2π×110 ≈ 691.15
const RADIUS = 110;
const CIRC = 2 * Math.PI * RADIUS;

// ── Curated Health & Life Quotes ──
const BREAK_QUOTES = [
  // 🌿 Health & Longevity
  { icon: '🌿', main: 'Your body is the vessel for every dream you\'ll ever chase.', sub: 'Treat it like the miracle it is.' },
  { icon: '🌿', main: 'Health is the crown only the sick can see.', sub: 'Guard it fiercely.' },
  { icon: '🌿', main: 'Sleep, water, movement, sunlight.', sub: 'The four pillars of a life well-lived.' },
  { icon: '🌿', main: 'You can\'t pour from an empty cup.', sub: 'Rest is not laziness — it\'s strategy.' },

  // ❤️ Loved Ones & Connection
  { icon: '❤️', main: 'The people who love you need you healthy, present, and alive.', sub: 'Show up for them by caring for yourself.' },
  { icon: '❤️', main: 'No success is worth the price of a broken relationship.', sub: 'Nurture your bonds.' },
  { icon: '❤️', main: 'One day you\'ll look back and the small moments were the big ones.', sub: 'Be present for your people.' },
  { icon: '❤️', main: 'Your energy is a gift to everyone around you.', sub: 'Protect it. Recharge it.' },

  // 🎯 Mission & Flow
  { icon: '🎯', main: 'Deep work is the superpower of the 21st century.', sub: 'Protect your focus like your most precious asset.' },
  { icon: '🎯', main: 'The magic you\'re looking for is in the work you\'re avoiding.', sub: 'But first, breathe.' },
  { icon: '🎯', main: 'Flow state is where genius lives.', sub: 'Build the conditions. Trust the process.' },
  { icon: '🎯', main: 'Discipline equals freedom.', sub: 'This break is part of the system.' },

  // 🔭 Long-term Thinking
  { icon: '🔭', main: 'The compound effect: small daily choices create extraordinary results.', sub: 'Play the long game.' },
  { icon: '🔭', main: 'In 10 years, today is the day you\'ll wish you started.', sub: 'You already did. Keep going.' },
  { icon: '🔭', main: 'Think in decades. Act in days.', sub: 'This moment is an investment in your future self.' },
  { icon: '🔭', main: 'The best time to plant a tree was 20 years ago. The second best is now.', sub: 'Every break fuels the next breakthrough.' },
];

const getRandomQuote = (excludeIndex) => {
  let idx;
  do {
    idx = Math.floor(Math.random() * BREAK_QUOTES.length);
  } while (idx === excludeIndex && BREAK_QUOTES.length > 1);
  return idx;
};

const Timer = ({ minutes, seconds, progress, mode, isActive, totalDuration, remainingMs }) => {
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Refs for rAF loop
  const ringGlowRef = useRef(null);
  const ringCircleRef = useRef(null);
  const rafRef = useRef(null);
  const displayRemainingRef = useRef(remainingMs);
  const authoritativeRemainingRef = useRef(remainingMs);

  // Always keep authoritative remaining up to date
  useEffect(() => {
    authoritativeRemainingRef.current = remainingMs;
  }, [remainingMs]);

  // ProMotion 60/120fps rendering loop
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      if (isActive) {
        // Linearly decrease visual time
        displayRemainingRef.current = Math.max(0, displayRemainingRef.current - dt);

        // Soft-sync with authoritative React state (useTimer)
        const diff = displayRemainingRef.current - authoritativeRemainingRef.current;
        if (Math.abs(diff) > 500) {
          // Snap if huge jump (e.g. wake from sleep or slider dragged)
          displayRemainingRef.current = authoritativeRemainingRef.current;
        } else {
          // Micro-correction (lerp)
          displayRemainingRef.current -= diff * 0.05;
        }
      } else {
        // Paused -> precisely match
        displayRemainingRef.current = authoritativeRemainingRef.current;
      }

      const p = Math.min(100, Math.max(0, ((totalDuration - displayRemainingRef.current) / totalDuration) * 100));
      const off = CIRC - (CIRC * p) / 100;

      if (ringGlowRef.current) ringGlowRef.current.style.strokeDashoffset = off;
      if (ringCircleRef.current) ringCircleRef.current.style.strokeDashoffset = off;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(performance.now());

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, totalDuration]);
  
  const [quoteIndex, setQuoteIndex] = useState(() => getRandomQuote(-1));
  const [fadeState, setFadeState] = useState('in'); // 'in' | 'out'
  const prevModeRef = useRef(mode);
  const rotationRef = useRef(null);

  // Pick new quote when entering break mode
  useEffect(() => {
    if (mode !== 'focus' && prevModeRef.current === 'focus') {
      setQuoteIndex(getRandomQuote(-1));
      setFadeState('in');
    }
    prevModeRef.current = mode;
  }, [mode]);

  // Rotate quotes every 30 seconds during break
  useEffect(() => {
    if (mode !== 'focus' && isActive) {
      rotationRef.current = setInterval(() => {
        setFadeState('out');
        setTimeout(() => {
          setQuoteIndex(prev => getRandomQuote(prev));
          setFadeState('in');
        }, 500); // wait for fade-out, then switch
      }, 30000);
    }

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
    };
  }, [mode, isActive]);

  const quote = BREAK_QUOTES[quoteIndex];

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
          ref={ringGlowRef}
          className="progress-ring-glow"
          cx="120" cy="120" r={RADIUS}
        />
        <circle
          ref={ringCircleRef}
          className="progress-ring-circle"
          cx="120" cy="120" r={RADIUS}
        />
      </svg>

      <div className="timer-display">
        <div className="time">{formattedTime}</div>
        {mode !== 'focus' && (
          <div className={`break-quote quote-${fadeState}`} key={quoteIndex}>
            <div className="quote-icon">{quote.icon}</div>
            <div className="quote-main">{quote.main}</div>
            <div className="quote-sub">{quote.sub}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;
