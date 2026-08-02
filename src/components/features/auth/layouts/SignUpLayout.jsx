import React from "react";
import { Link } from "react-router-dom";
import Footer from '../../../Footer';

export default function SignUpLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-tight">
          CseHub
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/signin" className="text-slate-400 hover:text-white">
            Sign In
          </Link>
          <Link to="/signup" className="font-semibold text-white">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-fuchsia-700 to-slate-900 items-center justify-center p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold tracking-tight">CseHub</h1>
            <p className="mt-6 text-lg text-fuchsia-100 leading-8">
              Create your account and start building strong foundations in core CS topics.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}