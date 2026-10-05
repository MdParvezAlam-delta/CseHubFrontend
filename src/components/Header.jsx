import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ darkMode, toggleDarkMode, setDarkMode }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminPage = location.pathname.startsWith('/admin');
  const isSubjectDetailPage = /^\/subjects\/[^/]+\/?$/.test(location.pathname);
  const useGreenFrame = isAdminPage || isSubjectDetailPage;
  const currentUser = user;
  const signedIn = isAuthenticated;
  const handleSignOut = signOut;

  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  });

  const handleToggle = () => {
    if (typeof toggleDarkMode === 'function') return toggleDarkMode();
    if (typeof setDarkMode === 'function') return setDarkMode(!darkMode);
  };

  const handleMobileToggle = () => setMobileOpen((prev) => !prev);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      navigate(`/?q=${encodeURIComponent(value)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`fixed top-0 z-50 h-16 w-full backdrop-blur-xl transition-colors ${useGreenFrame
      ? 'border-b border-emerald-800/20 bg-emerald-700 text-white shadow-sm [&_a]:!text-white [&_button]:!text-white [&_span]:!text-white'
      : 'border-b border-blue-900/20 bg-blue-700 text-white shadow-sm [&_a]:!text-white [&_button]:!text-white [&_span]:!text-white'
    }`}>
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-on-surface/5"
            title="Toggle Theme"
          >
            {darkMode ? 'light_mode' : 'dark_mode'}
          </button>

          <button
            type="button"
            onClick={handleMobileToggle}
            className="md:hidden material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-on-surface/5"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? 'close' : 'menu'}
          </button>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/#subjects"
              className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
            >
              Subjects
            </Link>
            <Link
              to={isAuthenticated ? '/notes' : '/signup'}
              className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
            >
              Notebook
            </Link>
            <Link
              to="/todo"
              className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
            >
              Todo
            </Link>
            <Link
              to="/admin"
              aria-current={location.pathname === '/admin' ? 'page' : undefined}
              className={`text-sm font-bold uppercase tracking-wider transition-colors px-3 py-2 ${location.pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Admin
            </Link>
            <div className="flex items-center gap-3 ml-2">
              {signedIn ? (
                <>
                  <span className="hidden lg:inline-block text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                    {currentUser?.display_name ? `Hi, ${currentUser.display_name}` : 'Welcome Back'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-sm font-bold uppercase tracking-wider border border-outline-variant px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="text-sm font-bold uppercase tracking-wider bg-primary text-on-primary px-5 py-2 rounded-lg hover:brightness-110 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className={`border-t px-4 py-4 backdrop-blur-xl md:hidden ${useGreenFrame
          ? 'border-emerald-800/20 bg-emerald-700 text-white [&_a]:!text-white [&_button]:!text-white [&_span]:!text-white'
          : 'border-blue-900/20 bg-blue-700 text-white [&_a]:!text-white [&_button]:!text-white [&_span]:!text-white'
        }`}>
          <div className="space-y-3">
            <Link
              to="/#subjects"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Subjects
            </Link>
            <Link
              to={isAuthenticated ? '/notes' : '/signup'}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Notebook
            </Link>
            <Link
              to="/todo"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
            >
              Todo
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              aria-current={location.pathname === '/admin' ? 'page' : undefined}
              className={`block text-sm font-bold uppercase tracking-wider transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Admin
            </Link>
            {signedIn ? (
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="w-full text-left text-sm font-bold uppercase tracking-wider border border-outline-variant px-3 py-2 rounded-lg text-on-surface-variant hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-bold uppercase tracking-wider bg-primary text-on-primary px-3 py-2 rounded-lg text-center hover:brightness-110 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;