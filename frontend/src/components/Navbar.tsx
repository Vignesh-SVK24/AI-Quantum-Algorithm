import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Atom, 
  BookOpen, 
  FlaskConical, 
  Cpu, 
  Bot, 
  Sparkles, 
  LayoutDashboard, 
  Info,
  Activity,
  Menu,
  X,
  Layers,
  LogIn,
  LogOut
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { profile, isGuest, isAuthenticated, signOut } = useAuth();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      try {
        const res = await checkBackendHealth();
        if (mounted) setBackendOnline(res.status === 'online');
      } catch {
        if (mounted) setBackendOnline(false);
      }
    };
    pollHealth();
    const interval = setInterval(pollHealth, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const baseNavLinks = [
    { name: 'Basics', path: '/basics', icon: BookOpen },
    { name: 'Quantum Lab', path: '/lab', icon: FlaskConical },
    { name: 'Playground', path: '/playground', icon: Cpu },
    { name: 'Algorithms', path: '/algorithms', icon: Layers },
    { name: 'AI Tutor', path: '/tutor', icon: Bot },
    { name: 'Practice', path: '/practice', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'About', path: '/about', icon: Info },
  ];

  const navLinks = isAuthenticated
    ? baseNavLinks
    : [...baseNavLinks, { name: 'Login', path: '/login', icon: LogIn }];

  const userInitial = (profile?.full_name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-floral-white/90 backdrop-blur-md border-b border-soft-sand/80 shadow-sm mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-warm-ivory border border-soft-sand flex items-center justify-center transition-all group-hover:border-black-olive/40 shadow-sm">
              <Atom className="w-5 h-5 text-black-olive group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-black-olive flex items-center gap-1 text-base sm:text-lg">
                Quantum<span className="text-olive-mist font-medium">Platform</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-olive-mist font-mono -mt-1">
                Botanical Noir EdTech
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-warm-ivory/60 p-1 rounded-2xl border border-soft-sand/60">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-black-olive text-floral-white shadow-sm'
                      : 'text-black-olive/75 hover:text-black-olive hover:bg-warm-ivory'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-warm-gold' : 'text-olive-mist'}`} />
                  {item.name}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-warm-gold ml-0.5" />}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Backend Health indicator & Auth / CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-olive-mist" />
              <span className="text-olive-mist text-[11px]">Qiskit:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline === true
                      ? 'bg-muted-sage animate-pulse'
                      : backendOnline === false
                      ? 'bg-cocoa-noir'
                      : 'bg-warm-gold animate-ping'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    backendOnline === true
                      ? 'text-deep-olive'
                      : backendOnline === false
                      ? 'text-cocoa-noir'
                      : 'text-olive-mist'
                  }`}
                >
                  {backendOnline === true ? 'Online' : backendOnline === false ? 'Offline' : 'Connecting...'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('quantum:start-tour'))}
              title="Interactive Platform Tour"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive text-xs font-semibold shadow-sm hover:bg-soft-sand transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-warm-gold" />
              Tour
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-warm-ivory border border-soft-sand hover:border-black-olive/40 hover:bg-soft-sand transition-all text-xs group"
                  title={profile?.email || 'Student Dashboard'}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      className="w-5 h-5 rounded-full object-cover border border-soft-sand"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-black-olive text-warm-gold text-[10px] font-bold flex items-center justify-center">
                      {userInitial}
                    </div>
                  )}
                  <span className="font-semibold text-black-olive max-w-[110px] truncate">
                    {profile?.full_name || 'Student'}
                  </span>
                  {isGuest && (
                    <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      Guest
                    </span>
                  )}
                </Link>

                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-olive-mist hover:text-cocoa-noir hover:bg-soft-sand transition-all text-xs font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive text-xs font-semibold shadow-sm hover:bg-soft-sand transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-warm-gold" />
                Login
              </Link>
            )}

            <Link
              to="/lab"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black-olive text-floral-white text-xs font-semibold shadow-sm hover:bg-deep-olive transition-all"
            >
              <FlaskConical className="w-3.5 h-3.5 text-soft-cyan" />
              Launch Lab
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive hover:bg-soft-sand transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-floral-white border-t border-soft-sand mx-4 mt-2 mb-4 px-4 py-4 space-y-2 rounded-2xl shadow-lg">
          {isAuthenticated && (
            <div className="p-3 mb-2 rounded-xl bg-warm-ivory border border-soft-sand flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-soft-sand"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black-olive text-warm-gold text-xs font-bold flex items-center justify-center">
                    {userInitial}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-xs text-black-olive flex items-center gap-1.5">
                    {profile?.full_name || 'Student'}
                    {isGuest && (
                      <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Guest
                      </span>
                    )}
                  </div>
                  {profile?.email && (
                    <div className="text-[11px] text-olive-mist truncate max-w-[180px]">
                      {profile.email}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-soft-sand/70 text-cocoa-noir hover:bg-soft-sand text-xs font-medium flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-black-olive text-floral-white'
                    : 'text-black-olive hover:bg-warm-ivory'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-warm-gold' : 'text-olive-mist'}`} />
                  {item.name}
                </div>
                {isActive && <span className="w-2 h-2 rounded-full bg-warm-gold" />}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('quantum:start-tour'));
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-black-olive hover:bg-warm-ivory transition-all border-t border-soft-sand/60 mt-2 pt-3"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-warm-gold" />
              Interactive Platform Tour
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
