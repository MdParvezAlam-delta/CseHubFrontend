import React from 'react';
import { Link } from 'react-router-dom';
function Header({ darkMode, toggleDarkMode, setDarkMode }) {
  const handleToggle = () => {
    if (typeof toggleDarkMode === 'function') return toggleDarkMode();
    if (typeof setDarkMode === 'function') return setDarkMode(!darkMode);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant h-16 transition-colors">
      <div className="flex items-center justify-between px-6 h-full w-full max-w-[1920px] mx-auto">
            <div className="text-xl font-black text-primary tracking-tighter">
              <Link to="/" className="cursor-pointer">CseHub</Link>
            </div>

        <div className="flex-1 max-w-2xl mx-12 hidden lg:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="bg-on-surface/5 border border-outline-variant rounded-lg px-9 py-2 text-sm text-on-surface focus:outline-none w-full transition-all"
              placeholder="Quick Search for protocols, modules..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggle}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-on-surface/5"
            title="Toggle Theme"
          >
            {darkMode ? 'light_mode' : 'dark_mode'}
          </button>

          <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/signin"
                  className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-4 py-2"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="text-sm font-bold uppercase tracking-wider bg-primary text-on-primary px-6 py-2 rounded-lg hover:brightness-110 transition-all"
                >
                  Sign Up
                </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;