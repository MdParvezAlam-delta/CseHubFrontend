import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 mb-24 flex flex-col items-center text-center">
      <div className="space-y-8 max-w-4xl">
        <h1 className="hero-title text-on-surface font-black tracking-tighter">
          CseHub <br/>
          <span className="text-primary">Master the Core.</span>
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          The definitive architectural platform for mastering the core concepts of computer science streams with interactive practicals. Engineered for qualifying technical interviews.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Link
            to={isAuthenticated ? '/notes' : '/signup'}
            className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-lg text-sm uppercase tracking-[0.15em] font-bold neon-glow transition-all active:scale-95 shadow-xl shadow-primary/20 text-center"
          >
            {isAuthenticated ? 'Open Notebook' : 'Register to Access Notebook'}
          </Link>
          <button className="w-full sm:w-auto border border-outline-variant hover:border-primary px-10 py-4 rounded-lg text-sm uppercase tracking-[0.15em] font-bold transition-all bg-white/5 text-on-surface">
            Documentation
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;