import { useLocation } from 'react-router-dom';

function Footer() {
  const { pathname } = useLocation();
  const useGreenFrame = pathname.startsWith('/admin') || /^\/subjects\/[^/]+\/?$/.test(pathname);

  return (
    <footer className={`w-full border-t py-12 ${useGreenFrame ? 'border-emerald-800/20 bg-emerald-700' : 'border-blue-900/20 bg-blue-700'}`}>
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-['Space_Grotesk'] text-lg font-bold text-white">
            CseHub Systems
          </div>
          <p className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest ${useGreenFrame ? 'text-emerald-100' : 'text-blue-100'}`}>
            © 2024 CseHub Technical Systems. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-8">
          <a className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-colors ${useGreenFrame ? 'text-emerald-100 hover:text-white' : 'text-blue-100 hover:text-white'}`} href="#">
            Documentation
          </a>
          <a className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-colors ${useGreenFrame ? 'text-emerald-100 hover:text-white' : 'text-blue-100 hover:text-white'}`} href="#">
            API Status
          </a>
          <a className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-colors ${useGreenFrame ? 'text-emerald-100 hover:text-white' : 'text-blue-100 hover:text-white'}`} href="#">
            Privacy Protocol
          </a>
          <a className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-colors ${useGreenFrame ? 'text-emerald-100 hover:text-white' : 'text-blue-100 hover:text-white'}`} href="#">
            Terms of Service
          </a>
          <a className={`font-['Space_Grotesk'] text-xs uppercase tracking-widest transition-colors ${useGreenFrame ? 'text-emerald-100 hover:text-white' : 'text-blue-100 hover:text-white'}`} href="#">
            Security
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;