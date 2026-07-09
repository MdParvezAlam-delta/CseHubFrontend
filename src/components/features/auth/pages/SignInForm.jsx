import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../../context/AuthContext';
import { validators } from '../../../../utils/validators';

export default function SignInForm() {
  const { signIn, isLoading, error: contextError, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    const emailError = validators.getErrorMessage('email', email);
    if (emailError) newErrors.email = emailError;

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    clearError();

    if (!validateForm()) return;

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      const newErrors = { ...errors };
      delete newErrors.password;
      setErrors(newErrors);
    }
  };

  const displayError = localError || contextError;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign In</h2>
        <p className="mt-2 text-sm text-slate-300">
          Welcome back to CseHub. Sign in to continue your learning journey.
        </p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
          {displayError}
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        <span className="material-symbols-outlined text-[20px]">login</span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className={`w-full rounded-xl border bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition ${
              errors.email
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <a href="#" className="text-xs text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="********"
            disabled={isLoading}
            className={`w-full rounded-xl border bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition ${
              errors.password
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" />
            Remember me
          </label>

          <Link to="/signup" className="text-blue-400 hover:underline">
            Create account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}