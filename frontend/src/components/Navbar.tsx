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
  LogIn
} from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
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

  const navLinks = [
    { name: 'Basics', path: '/basics', icon: BookOpen },
    { name: 'Quantum Lab', path: '/lab', icon: FlaskConical },
    { name: 'Playground', path: '/playground', icon: Cpu },
    { name: 'Algorithms', path: '/algorithms', icon: Layers },
    { name: 'AI Tutor', path: '/tutor', icon: Bot },
    { name: 'Practice', path: '/practice', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Login', path: '/login', icon: LogIn },
  ];

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

          {/* Right side: Backend Health indicator & CTA */}
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

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-warm-ivory border border-soft-sand text-black-olive text-xs font-semibold shadow-sm hover:bg-soft-sand transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-warm-gold" />
              Login
            </Link>

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
        </div>
      )}
    </header>
  );
};
