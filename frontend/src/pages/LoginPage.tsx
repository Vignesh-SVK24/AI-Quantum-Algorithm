import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form State (transient only in memory, never persisted)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation Errors State
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const [hasInteracted, setHasInteracted] = useState(false);

  // Background Video muted autoplay enforcement (iOS/Android compatible)
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
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry on user interaction
        });
      }
    };

    attemptPlay();

    const handleUserInteraction = () => {
      if (video.paused) {
        attemptPlay();
      }
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g., student@quantum.edu).';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Mark session as explored (never store password or sensitive credentials)
      try {
        sessionStorage.setItem('isExplored', 'true');
        sessionStorage.setItem('userName', name.trim());
      } catch {
        // Safe fallback if sessionStorage is disabled
      }

      // Seamless navigation to Home Page route
      navigate('/');
    }
  };

  // Real-time error clearance after initial attempt
  const handleNameChange = (val: string) => {
    setName(val);
    if (hasInteracted && errors.name) {
      setErrors(prev => ({ ...prev, name: val.trim() ? undefined : 'Please enter your name.' }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (hasInteracted && errors.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const errorMsg = !val.trim()
        ? 'Please enter your email address.'
        : !emailPattern.test(val.trim())
        ? 'Please enter a valid email format (e.g., student@quantum.edu).'
        : undefined;
      setErrors(prev => ({ ...prev, email: errorMsg }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (hasInteracted && errors.password) {
      setErrors(prev => ({ ...prev, password: val ? undefined : 'Please enter your password.' }));
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden">
      {/* Background Video Layer reusing existing asset */}
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

        {/* Subtle Dark / Olive Overlay ensuring high readability */}
        <div className="absolute inset-0 bg-black-olive/80 sm:bg-black-olive/75 backdrop-blur-[2px]" />

        {/* Botanical Quantum Orbit Aesthetic Accent */}
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

      {/* Centered Glass / Premium Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-slate-glow/90 border border-soft-slate/40 shadow-slate-glow backdrop-blur-md p-6 sm:p-8 text-floral-white space-y-6">
        {/* Header & Minimal Branding */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-deep-slate/90 border border-soft-slate/50 flex items-center justify-center shadow-sm">
              <Atom className="w-5 h-5 text-warm-gold animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-muted-sage font-bold block">
                QuantumPlatform
              </span>
              <span className="text-[10px] text-soft-slate block -mt-0.5">
                Botanical Noir EdTech
              </span>
            </div>
          </div>

          <div className="pt-1">
            <h1 className="text-2xl sm:text-[26px] font-serif font-bold text-floral-white tracking-tight leading-tight">
              Welcome to Quantum Algorithm
            </h1>
            <p className="text-xs text-muted-sage mt-1 leading-relaxed">
              Experience superposition, statevectors, and quantum circuit algorithms with real-time Qiskit simulation.
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
          {/* Name Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="login-name" className="block text-xs font-semibold text-warm-ivory">
              Full Name
            </label>
            <input
              id="login-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-deep-slate/85 border text-sm text-floral-white placeholder:text-warm-ivory/40 outline-none transition-all focus:ring-2 ${
                errors.name
                  ? 'border-red-400/80 focus:ring-red-400/40 focus:border-red-400'
                  : 'border-soft-slate/50 focus:border-soft-cyan focus:ring-soft-cyan/30'
              }`}
            />
            {errors.name && (
              <p className="text-red-300 text-[11px] font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="login-email" className="block text-xs font-semibold text-warm-ivory">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-deep-slate/85 border text-sm text-floral-white placeholder:text-warm-ivory/40 outline-none transition-all focus:ring-2 ${
                errors.email
                  ? 'border-red-400/80 focus:ring-red-400/40 focus:border-red-400'
                  : 'border-soft-slate/50 focus:border-soft-cyan focus:ring-soft-cyan/30'
              }`}
            />
            {errors.email && (
              <p className="text-red-300 text-[11px] font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="login-password" className="block text-xs font-semibold text-warm-ivory">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-deep-slate/85 border text-sm text-floral-white placeholder:text-warm-ivory/40 outline-none transition-all focus:ring-2 ${
                  errors.password
                    ? 'border-red-400/80 focus:ring-red-400/40 focus:border-red-400'
                    : 'border-soft-slate/50 focus:border-soft-cyan focus:ring-soft-cyan/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/60 hover:text-warm-ivory transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-soft-cyan"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-warm-ivory/70" />
                ) : (
                  <Eye className="w-4 h-4 text-warm-ivory/70" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-[11px] font-medium flex items-center gap-1.5 pt-0.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Explore Primary Button */}
          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-warm-gold via-[#D8BC7E] to-muted-sage text-black-olive shadow-botanical-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-warm-gold/60"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.setItem('isExplored', 'true');
                  sessionStorage.setItem('userName', 'Guest Explorer');
                } catch {
                  // Ignore
                }
                navigate('/');
              }}
              className="w-full py-2 text-center text-xs text-muted-sage hover:text-warm-ivory transition-colors cursor-pointer"
            >
              Skip and Enter as Guest &rarr;
            </button>
          </div>
        </form>

        {/* Subtle Supporting Footer Line */}
        <div className="pt-1 text-center border-t border-soft-slate/30">
          <span className="text-[11px] text-muted-sage/80 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-warm-gold" />
            Interactive Quantum Computing Sandbox &middot; Open Access
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
