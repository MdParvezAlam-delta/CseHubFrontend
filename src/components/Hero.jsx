import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 mb-24 flex flex-col items-center text-center">
      <div className="space-y-6 max-w-4xl">
        <h1 className="hero-title text-on-surface font-black tracking-tighter text-7xl md:text-[6.5rem] leading-tight md:leading-[0.95]">
          CseHub
        </h1>
        <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Master Your Curricullam
        </h2>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          The definitive architectural platform for mastering the computer science streams with interactive Quiz and AI supportive doubt clear functionality and Engineered for qualifying technical interviews.
        </p>
      </div>
    </section>
  );
}

export default Hero;