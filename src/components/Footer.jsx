import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-950 w-full border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-lg font-bold text-slate-200 font-['Space_Grotesk']">
            CseHub Systems
          </div>
          <p className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500">
            © 2024 CseHub Technical Systems. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-8">
          <a className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors" href="#">
            Documentation
          </a>
          <a className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors" href="#">
            API Status
          </a>
          <a className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors" href="#">
            Privacy Protocol
          </a>
          <a className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors" href="#">
            Security
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;