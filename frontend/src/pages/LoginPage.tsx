import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Atom, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  KeyRound, 
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInAsGuest, 
    sendPasswordReset, 
    updatePassword,
    isAuthenticated
  } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine initial mode from URL (e.g., /login?mode=signup or /login?type=recovery)
  const initialMode = useMemo<AuthMode>(() => {
    const typeParam = searchParams.get('type') || '';
    const modeParam = searchParams.get('mode') || '';
    if (typeParam === 'recovery' || location.hash.includes('type=recovery')) {
      return 'reset';
    }
    if (modeParam === 'signup') {
      return 'signup';
    }
    return 'signin';
  }, [searchParams, location.hash]);

  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Destination redirect after successful login
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  // If already authenticated and not in password-reset mode, redirect to target
  useEffect(() => {
    if (isAuthenticated && mode !== 'reset') {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, mode, navigate, from]);

  // Background Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const attemptPlay = () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    attemptPlay();

    const handleInteraction = () => {
      if (video.paused) attemptPlay();
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Password Strength Meter Calculations
  const passwordCriteria = useMemo(() => {
    const minLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    let strengthScore = 0;
    if (minLength) strengthScore += 1;
    if (hasLetter) strengthScore += 1;
    if (hasNumberOrSymbol) strengthScore += 1;

    return {
      minLength,
      hasLetter,
      hasNumberOrSymbol,
      score: strengthScore,
      label: strengthScore === 3 ? 'Strong' : strengthScore === 2 ? 'Moderate' : 'Weak',
      colorClass: strengthScore === 3 ? 'bg-muted-sage' : strengthScore === 2 ? 'bg-warm-gold' : 'bg-red-400'
    };
  }, [password]);

  // Client Validation
  const validate = (): boolean => {
    setGeneralError(null);

    const emailTrimmed = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      setGeneralError('Please enter your email address.');
      return false;
    }
    if (!emailPattern.test(emailTrimmed)) {
      setGeneralError('Please enter a valid email address (e.g. name@university.edu).');
      return false;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setGeneralError('Please enter your full name.');
        return false;
      }
      if (password.length < 6) {
        setGeneralError('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setGeneralError('Passwords do not match. Please re-enter your password.');
        return false;
      }
    }

    if (mode === 'signin') {
      if (!password) {
        setGeneralError('Please enter your password.');
        return false;
      }
    }

    if (mode === 'reset') {
      if (password.length < 6) {
        setGeneralError('New password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setGeneralError('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setGeneralError(result.error);
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'signup') {
        const result = await signUpWithEmail(email, password, name);
        if (result.error) {
          setGeneralError(result.error);
        } else if (result.requiresEmailConfirmation) {
          setSuccessMessage(
            'Account created! A confirmation link has been sent to your email. Please check your inbox before signing in.'
          );
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'forgot') {
        const result = await sendPasswordReset(email);
        if (result.error) {
          setGeneralError(result.error);
        } else {
          setSuccessMessage(
            'Password recovery link sent! Please check your email inbox to complete password reset.'
          );
        }
      } else if (mode === 'reset') {
        const result = await updatePassword(password);
        if (result.error) {
          setGeneralError(result.error);
        } else {
          setSuccessMessage('Your password has been successfully updated. You can now sign in.');
          setMode('signin');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err: any) {
      setGeneralError('An unexpected authentication error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Trigger
  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setGeneralError(null);
    setSuccessMessage(null);

    const result = await signInWithGoogle();
    if (result.error) {
      setGeneralError(result.error);
      setLoading(false);
    }
  };

  // Anonymous Guest Access Trigger
  const handleGuestSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setGeneralError(null);

    const result = await signInAsGuest();
    if (result.error) {
      setGeneralError(result.error);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="auto"
          className="w-full h-full object-cover object-center scale-105"
        >
          <source src={`${import.meta.env.BASE_URL}video/Animate_this_image.mp4`} type="video/mp4" />
          <source src="./video/Animate_this_image.mp4" type="video/mp4" />
          <source src="/video/Animate_this_image.mp4" type="video/mp4" />
        </video>

        {/* Botanical Noir Semi-Opaque Readability Layer */}
        <div className="absolute inset-0 bg-black-olive/80 sm:bg-black-olive/75 backdrop-blur-[2px]" />

        {/* Quantum Orbital SVG Aesthetics */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="login-quantum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A86A" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8FBFC0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A7B09A" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d="M-100,200 C350,100 650,400 1200,220 C1650,100 1950,300 2400,160" fill="none" stroke="url(#login-quantum-grad)" strokeWidth="1.5" />
          <path d="M-50,600 C420,480 780,680 1350,540 C1820,420 2150,600 2500,480" fill="none" stroke="url(#login-quantum-grad)" strokeWidth="1" strokeDasharray="6,6" />
        </svg>
      </div>

      {/* Centered Glass / Slate Glow Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-slate-glow/95 border border-soft-slate/40 shadow-slate-glow backdrop-blur-md p-6 sm:p-8 text-floral-white space-y-6">
        
        {/* Header Branding */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-deep-slate border border-soft-slate/50 flex items-center justify-center shadow-sm">
                <Atom className="w-5 h-5 text-warm-gold animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-muted-sage font-bold block">
                  QuantumPlatform
                </span>
                <span className="text-[10px] text-soft-slate block -mt-0.5">
                  Production Supabase Auth
                </span>
              </div>
            </div>

            {/* Back button when in forgot / reset modes */}
            {(mode === 'forgot' || mode === 'reset') && (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setGeneralError(null);
                  setSuccessMessage(null);
                }}
                className="flex items-center gap-1 text-xs text-muted-sage hover:text-warm-ivory transition-colors px-2 py-1 rounded-lg bg-deep-slate/60 border border-soft-slate/40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="pt-1">
            <h1 className="text-2xl sm:text-[25px] font-serif font-bold text-floral-white tracking-tight leading-tight">
              {mode === 'signin' && 'Welcome to Quantum Platform'}
              {mode === 'signup' && 'Create Student Account'}
              {mode === 'forgot' && 'Reset Your Password'}
              {mode === 'reset' && 'Set New Password'}
            </h1>
            <p className="text-xs text-muted-sage mt-1 leading-relaxed">
              {mode === 'signin' && 'Sign in to access your saved circuits, practice progress, and personalized AI tutor.'}
              {mode === 'signup' && 'Join the interactive platform grounded in Dirac mechanics and Qiskit simulation.'}
              {mode === 'forgot' && 'Enter your email address to receive an official password recovery link.'}
              {mode === 'reset' && 'Enter a secure new password to update your student credentials.'}
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs (Sign In / Sign Up) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="flex p-1 bg-deep-slate rounded-2xl border border-soft-slate/40">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setGeneralError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/30 shadow-sm'
                  : 'text-warm-ivory/60 hover:text-warm-ivory'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setGeneralError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-slate-glow text-soft-cyan border border-soft-cyan/30 shadow-sm'
                  : 'text-warm-ivory/60 hover:text-warm-ivory'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-muted-sage/15 border border-muted-sage/40 flex items-start gap-2.5 text-xs text-muted-sage">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-muted-sage" />
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Error Alert Banner */}
        {generalError && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start justify-between gap-2.5 text-xs text-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <p className="leading-relaxed">{generalError}</p>
            </div>
            <button
              type="button"
              onClick={() => setGeneralError(null)}
              className="text-red-400 hover:text-red-200 p-0.5"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Interactive Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5 text-left">
              <label htmlFor="auth-name" className="block text-xs font-semibold text-warm-ivory">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Marie Curie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-deep-slate/85 border border-soft-slate/50 text-sm text-floral-white placeholder:text-warm-ivory/30 outline-none transition-all focus:border-soft-cyan focus:ring-2 focus:ring-soft-cyan/30"
                />
                <UserIcon className="w-4 h-4 text-warm-ivory/40 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Email Address (Sign In, Sign Up, Forgot) */}
          {mode !== 'reset' && (
            <div className="space-y-1.5 text-left">
              <label htmlFor="auth-email" className="block text-xs font-semibold text-warm-ivory">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@quantum.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-deep-slate/85 border border-soft-slate/50 text-sm text-floral-white placeholder:text-warm-ivory/30 outline-none transition-all focus:border-soft-cyan focus:ring-2 focus:ring-soft-cyan/30"
                />
                <Mail className="w-4 h-4 text-warm-ivory/40 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Password (Sign In, Sign Up, Reset) */}
          {mode !== 'forgot' && (
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="block text-xs font-semibold text-warm-ivory">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setGeneralError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-warm-gold hover:underline font-medium focus:outline-none"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-deep-slate/85 border border-soft-slate/50 text-sm text-floral-white placeholder:text-warm-ivory/30 outline-none transition-all focus:border-soft-cyan focus:ring-2 focus:ring-soft-cyan/30"
                />
                <Lock className="w-4 h-4 text-warm-ivory/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/50 hover:text-warm-ivory transition-colors p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Password Strength Meter (Sign Up & Reset) */}
              {(mode === 'signup' || mode === 'reset') && password.length > 0 && (
                <div className="pt-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-warm-ivory/60">Strength:</span>
                    <span className={`font-mono font-bold ${
                      passwordCriteria.score === 3 ? 'text-muted-sage' : passwordCriteria.score === 2 ? 'text-warm-gold' : 'text-red-400'
                    }`}>
                      {passwordCriteria.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-deep-slate rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full transition-all ${passwordCriteria.score >= 1 ? passwordCriteria.colorClass : 'bg-soft-slate/40'}`} />
                    <div className={`h-full flex-1 rounded-full transition-all ${passwordCriteria.score >= 2 ? passwordCriteria.colorClass : 'bg-soft-slate/40'}`} />
                    <div className={`h-full flex-1 rounded-full transition-all ${passwordCriteria.score >= 3 ? passwordCriteria.colorClass : 'bg-soft-slate/40'}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-warm-ivory/60 pt-0.5">
                    <span className={`flex items-center gap-1 ${passwordCriteria.minLength ? 'text-muted-sage' : ''}`}>
                      {passwordCriteria.minLength ? <Check className="w-3 h-3" /> : '•'} 6+ characters
                    </span>
                    <span className={`flex items-center gap-1 ${passwordCriteria.hasNumberOrSymbol ? 'text-muted-sage' : ''}`}>
                      {passwordCriteria.hasNumberOrSymbol ? <Check className="w-3 h-3" /> : '•'} Number or symbol
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirm Password (Sign Up & Reset) */}
          {(mode === 'signup' || mode === 'reset') && (
            <div className="space-y-1.5 text-left">
              <label htmlFor="auth-confirm-password" className="block text-xs font-semibold text-warm-ivory">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-deep-slate/85 border border-soft-slate/50 text-sm text-floral-white placeholder:text-warm-ivory/30 outline-none transition-all focus:border-soft-cyan focus:ring-2 focus:ring-soft-cyan/30"
                />
                <KeyRound className="w-4 h-4 text-warm-ivory/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/50 hover:text-warm-ivory transition-colors p-1 rounded-md"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-red-400 text-[11px] pt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-warm-gold via-[#D8BC7E] to-muted-sage text-black-olive shadow-botanical-glow hover:brightness-105 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-warm-gold/60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black-olive" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Recovery Email'}
                    {mode === 'reset' && 'Update Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider for Social & Guest options (in signin and signup modes) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="space-y-4 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-soft-slate/40" />
              <span className="absolute bg-slate-glow px-3 text-[10px] uppercase font-mono tracking-widest text-warm-ivory/50">
                Or Continue With
              </span>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-deep-slate border border-soft-slate/50 text-xs font-semibold text-floral-white hover:bg-slate-glow/90 hover:border-soft-cyan/40 transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Guest Access Button */}
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-transparent border border-dashed border-soft-slate/60 text-xs font-semibold text-muted-sage hover:text-warm-ivory hover:border-warm-gold/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-warm-gold" />
              <span>Continue as Guest (Instant Access)</span>
            </button>
          </div>
        )}

        {/* Security & RLS Compliance Note */}
        <div className="pt-2 text-center border-t border-soft-slate/30 text-[10px] text-muted-sage/70 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-sage" />
          <span>Protected with Supabase Auth &middot; Row Level Security Enabled</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
