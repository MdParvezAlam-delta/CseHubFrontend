import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../../context/AuthContext';
import { validators } from '../../../../utils/validators';

export default function SignUpForm() {
  const { signUp, isLoading, error: contextError, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [localError, setLocalError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    const nameError = validators.getErrorMessage('name', name);
    if (nameError) newErrors.name = nameError;

    const emailError = validators.getErrorMessage('email', email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validators.getErrorMessage('password', password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms and Conditions';
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
      await signUp(name, email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      const newErrors = { ...errors };
      delete newErrors.name;
      setErrors(newErrors);
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

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      const newErrors = { ...errors };
      delete newErrors.confirmPassword;
      setErrors(newErrors);
    }
  };

  const passwordStrength = validators.getPasswordStrengthLabel(password);
  const strengthColor =
    passwordStrength === 'Weak'
      ? 'text-red-400'
      : passwordStrength === 'Fair'
      ? 'text-yellow-400'
      : passwordStrength === 'Good'
      ? 'text-blue-400'
      : 'text-green-400';

  const displayError = localError || contextError;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Sign Up</h2>
        <p className="mt-2 text-sm text-slate-300">
          Create your CseHub account and start building strong foundations.
        </p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
          {displayError}
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        <span className="material-symbols-outlined text-[20px]">person</span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Your name"
            disabled={isLoading}
            className={`w-full rounded-xl border bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition ${
              errors.name
                ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

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
            {password && (
              <span className={`text-xs font-medium ${strengthColor}`}>
                Strength: {passwordStrength}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Minimum 8 characters with uppercase, lowercase, number, and special character"
              disabled={isLoading}
              className={`w-full rounded-xl border bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition text-sm ${
                errors.password
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          {password && !errors.password && (
            <p className="mt-1 text-xs text-slate-400">
              ✓ Password meets requirements
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Re-enter your password"
              disabled={isLoading}
              className={`w-full rounded-xl border bg-[#0b0f19] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition ${
                errors.confirmPassword
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-lg">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              if (errors.terms) {
                const newErrors = { ...errors };
                delete newErrors.terms;
                setErrors(newErrors);
              }
            }}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent cursor-pointer"
          />
          <p>
            I agree to the{' '}
            <a href="#" className="text-blue-400 hover:underline">
              Terms and Conditions
            </a>
          </p>
        </div>
        {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}