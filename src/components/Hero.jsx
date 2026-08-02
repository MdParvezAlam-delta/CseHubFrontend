import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { isAuthenticated } = useAuth();
  const titleLetters = ['C', 's', 'e', 'H', 'u', 'b'];
  const heroWords = ['Master', 'Your', 'Curricullam'];

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.connect(context.destination);

    const playTone = (frequency, startTime, duration = 0.1) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.connect(gain);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const start = context.currentTime + 0.12;
    titleLetters.forEach((_, index) => {
      playTone(300 + index * 18, start + index * 0.12, 0.1);
    });

    heroWords.forEach((_, index) => {
      playTone(440 + index * 22, start + 0.84 + index * 0.28, 0.14);
    });

    playTone(520, start + 1.98, 0.22);

    return () => {
      if (context && context.state !== 'closed') {
        context.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 mb-24 flex flex-col items-center text-center">
      <div className="relative space-y-6 max-w-3xl">
        <h1 className="hero-title text-on-surface font-black tracking-tighter text-5xl sm:text-6xl md:text-[6.5rem] leading-tight md:leading-[0.95]">
          {titleLetters.map((letter, index) => (
            <span key={index} className="hero-letter" style={{ '--letter-index': index }}>
              {letter}
            </span>
          ))}
        </h1>
        <h2 className="hero-subtitle text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {heroWords.map((word, index) => (
            <React.Fragment key={word}>
              <span className="hero-word" style={{ '--word-index': index }}>
                {word}
              </span>
              {index < heroWords.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </h2>
        <p className="hero-copy text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          The definitive architectural platform for mastering the computer science streams with interactive Quiz and AI supportive doubt clear functionality and engineered for qualifying technical interviews.
        </p>
      </div>
    </section>
  );
}

export default Hero;