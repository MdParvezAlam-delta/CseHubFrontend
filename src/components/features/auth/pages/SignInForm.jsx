import React from "react";
import { Link } from "react-router-dom";

export default function SignInForm() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign In</h2>
        <p className="mt-2 text-sm text-slate-300">
          Welcome back to CseHub. Sign in to continue your learning journey.
        </p>
      </div>

      <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        <span className="material-symbols-outlined text-[20px]">login</span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            placeholder="********"
            className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
            Remember me
          </label>

          <Link to="/signup" className="text-primary hover:underline">
            Create account
          </Link>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#0b0f19] transition hover:brightness-110"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}