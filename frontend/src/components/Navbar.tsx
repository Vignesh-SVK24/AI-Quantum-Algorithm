import React, { useEffect, useState, useRef } from 'react';
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
  Menu,
  X,
  Layers,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { profile, isGuest, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  const getLoginTypeLabel = (provider?: string | null, guest?: boolean) => {
    if (guest || provider === 'anonymous') return 'Guest Account';
    if (provider === 'google') return 'Google Account';
    if (provider === 'email') return 'Email / Password';
    return provider ? provider.toUpperCase() : 'Verified Account';
  };

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
                Interactive Learning
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

          {/* Right side: Tour & User Profile Icon / Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
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
              <div className="relative" ref={profileMenuRef}>
                {/* Profile Icon Only Button */}
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="relative flex items-center justify-center p-0.5 rounded-full border-2 border-soft-sand hover:border-black-olive/40 focus:outline-none focus:ring-2 focus:ring-warm-gold/40 transition-all shadow-sm group bg-warm-ivory cursor-pointer"
                  title={profile?.full_name || profile?.email || 'Student Profile'}
                  aria-expanded={profileMenuOpen}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Profile'}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-black-olive text-warm-gold text-xs font-bold flex items-center justify-center group-hover:bg-deep-olive transition-colors">
                      {userInitial}
                    </div>
                  )}
                  {isGuest && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-floral-white"
                      title="Guest session"
                    />
                  )}
                </button>

                {/* Animated Dropdown Menu with Name, Type of Login, and Logout */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-floral-white border border-soft-sand shadow-xl p-3.5 z-50 profile-dropdown-animate">
                    {/* User Identity Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-soft-sand/70">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover border border-soft-sand"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black-olive text-warm-gold text-sm font-bold flex items-center justify-center shadow-sm">
                          {userInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-black-olive truncate">
                          {profile?.full_name || (isGuest ? 'Guest Scholar' : 'Student')}
                        </div>
                        {profile?.email && (
                          <div className="text-[11px] text-olive-mist truncate" title={profile.email}>
                            {profile.email}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Type of Login */}
                    <div className="py-2.5 px-1 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-olive-mist block">
                        Type of Login
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warm-ivory border border-soft-sand text-xs font-medium text-black-olive">
                        <span className={`w-2 h-2 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-warm-gold'}`} />
                        {getLoginTypeLabel(profile?.auth_provider, isGuest)}
                      </div>
                    </div>

                    {/* Navigation & Logout inside Dropdown */}
                    <div className="pt-2 border-t border-soft-sand/70 space-y-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-black-olive hover:bg-warm-ivory transition-all"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-olive-mist" />
                        Student Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-cocoa-noir hover:bg-rose-50 hover:text-red-700 transition-all text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
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
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
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
        <div className="lg:hidden bg-floral-white border-t border-soft-sand mx-4 mt-2 mb-4 px-4 py-4 space-y-2 rounded-2xl shadow-lg">
          {isAuthenticated && (
            <div className="p-3 mb-2 rounded-xl bg-warm-ivory border border-soft-sand space-y-2.5">
              <div className="flex items-center gap-2.5">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="w-9 h-9 rounded-full object-cover border border-soft-sand"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-black-olive text-warm-gold text-xs font-bold flex items-center justify-center">
                    {userInitial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-black-olive truncate">
                    {profile?.full_name || (isGuest ? 'Guest Scholar' : 'Student')}
                  </div>
                  {profile?.email && (
                    <div className="text-[11px] text-olive-mist truncate">
                      {profile.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-soft-sand/60">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-floral-white border border-soft-sand text-[11px] font-medium text-black-olive">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGuest ? 'bg-amber-400' : 'bg-warm-gold'}`} />
                  {getLoginTypeLabel(profile?.auth_provider, isGuest)}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-soft-sand/70 text-cocoa-noir hover:bg-rose-50 hover:text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
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
