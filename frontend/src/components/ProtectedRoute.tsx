import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Atom, ShieldAlert, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRegistered?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRegistered = false,
}) => {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-glow border border-soft-cyan/30 flex items-center justify-center shadow-md">
          <Atom className="w-8 h-8 text-warm-gold animate-spin-slow" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-serif font-bold text-black-olive">Verifying Quantum Session</p>
          <p className="text-xs text-olive-mist">Authenticating your cryptographic student identity...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a route specifically requires a permanent registered account (e.g. permanent certification)
  if (requireRegistered && isGuest) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-slate-glow text-floral-white border border-soft-slate/40 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-deep-slate border border-warm-gold/40 flex items-center justify-center text-warm-gold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif">Registered Account Required</h2>
            <p className="text-xs text-muted-sage">You are currently browsing with a temporary Guest account.</p>
          </div>
        </div>

        <p className="text-xs text-warm-ivory/80 leading-relaxed">
          To save permanent achievement certificates, synchronize cross-device progress, and track lifetime mastery, please create a free permanent account or sign in with Google.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/login?mode=signup"
            state={{ from: location }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-warm-gold via-[#D8BC7E] to-muted-sage text-black-olive font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Permanent Account</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-deep-slate border border-soft-slate/50 text-warm-ivory text-xs font-semibold hover:bg-slate-glow transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
