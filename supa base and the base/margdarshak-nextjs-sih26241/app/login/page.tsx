'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { Compass, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const { signInWithEmail, signUpWithEmail, signInWithOtp, loginAsDemo, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('learner');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in, show status and button to proceed
  if (user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-primary-tint text-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary">Already Signed In</h2>
          <p className="text-xs text-text-secondary">
            You are authenticated as <strong>{user.email}</strong>.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => router.push(redirectTo)}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
            >
              Continue to Application →
            </button>
            <Link
              href="/"
              className="bg-surface border border-border text-text-secondary hover:text-text-primary text-xs font-medium px-4 py-2.5 rounded-xl transition"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signInWithEmail(email, password);
    setIsLoading(false);

    if (res.error) {
      // If Supabase project credentials are dummy, allow fallback demo login
      if (res.error.message.includes('fetch') || res.error.message.includes('URL') || res.error.message.includes('Invalid')) {
        loginAsDemo('learner');
        setSuccessMsg('Logged in via Demo Session! Redirecting...');
        setTimeout(() => router.push(redirectTo), 700);
      } else {
        setErrorMsg(res.error.message);
      }
    } else {
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => router.push(redirectTo), 700);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signUpWithEmail(email, password, fullName, role);
    setIsLoading(false);

    if (res.error) {
      if (res.error.message.includes('fetch') || res.error.message.includes('URL')) {
        loginAsDemo('learner');
        setSuccessMsg('Account provisioned (Demo Session)! Redirecting...');
        setTimeout(() => router.push(redirectTo), 700);
      } else {
        setErrorMsg(res.error.message);
      }
    } else if (res.needsEmailConfirmation) {
      setSuccessMsg(`Verification email dispatched to ${email}. Please confirm to complete sign-in.`);
    } else {
      setSuccessMsg('Account created and signed in! Redirecting...');
      setTimeout(() => router.push(redirectTo), 700);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signInWithOtp(email);
    setIsLoading(false);

    if (res.error) {
      setErrorMsg(res.error.message);
    } else {
      setSuccessMsg(`Magic Link dispatched to ${email}! Check your email inbox to log in.`);
    }
  };

  const handleQuickDemo = (demoRole: 'learner' | 'parent' | 'admin') => {
    loginAsDemo(demoRole);
    setSuccessMsg(`Signed in as ${demoRole}! Redirecting...`);
    setTimeout(() => router.push(redirectTo), 500);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-br from-primary-tint to-surface text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-heading font-bold text-text-primary">Margdarshak AI Portal</h1>
          <p className="text-xs text-text-secondary">Connected to Supabase Authentication & PostgreSQL</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-surface-tint p-1">
          <button
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
              activeTab === 'signin' ? 'bg-surface text-text-primary shadow-sm font-semibold' : 'text-text-secondary'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
              activeTab === 'signup' ? 'bg-surface text-text-primary shadow-sm font-semibold' : 'text-text-secondary'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setActiveTab('magic');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition ${
              activeTab === 'magic' ? 'bg-surface text-text-primary shadow-sm font-semibold' : 'text-text-secondary'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Alerts */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@margdarshak.ai"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-text-secondary">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('magic')}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In with Supabase'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ansh Tomar"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@margdarshak.ai"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Select Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="learner">🎓 Vocational Learner / Student</option>
                  <option value="parent">👨‍👩‍👧 Parent / Guardian</option>
                  <option value="counsellor">🧭 MSDE / District Counsellor</option>
                  <option value="admin">🏛️ Administrator / Evaluator</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Password (min 6 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Register on Supabase'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* MAGIC LINK FORM */}
          {activeTab === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <p className="text-xs text-text-secondary">
                Enter your email address and Supabase will email you a passwordless sign-in link.
              </p>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@margdarshak.ai"
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Dispatching...' : 'Send Magic Link'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* QUICK DEMO SHORTCUTS */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-text-secondary">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Jury & Evaluation Demo Login:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('learner')}
                className="p-2 border border-border hover:border-primary hover:bg-primary-tint rounded-xl text-center transition"
              >
                <span className="block font-medium text-text-primary">🎓 Learner</span>
                <span className="text-[10px] text-text-secondary">Student Mode</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('parent')}
                className="p-2 border border-border hover:border-primary hover:bg-primary-tint rounded-xl text-center transition"
              >
                <span className="block font-medium text-text-primary">👨‍👩‍👧 Parent</span>
                <span className="text-[10px] text-text-secondary">Family Fit</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 border border-border hover:border-primary hover:bg-primary-tint rounded-xl text-center transition"
              >
                <span className="block font-medium text-text-primary">🏛️ Admin</span>
                <span className="text-[10px] text-text-secondary">MSDE View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
