import React from 'react';

function FAB() {
  return (
    <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-full shadow-[0_0_20px_rgba(184,195,255,0.4)] flex items-center justify-center text-on-primary z-40 hover:scale-110 active:scale-95 transition-transform group">
      <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">terminal</span>
    </button>
  );
}

export default FAB;