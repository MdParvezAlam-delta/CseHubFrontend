import React from "react";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign Up</h2>
        <p className="mt-2 text-sm text-slate-300">
          Create your CseHub account and start building strong foundations.
        </p>
      </div>

      <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        <span className="material-symbols-outlined text-[20px]">person</span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            placeholder="********"
            className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-start gap-2 text-sm text-slate-300">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent" />
          <p>
            I agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms and Conditions
            </a>
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#0b0f19] transition hover:brightness-110"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}