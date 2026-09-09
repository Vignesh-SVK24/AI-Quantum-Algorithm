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
  X
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
    { name: 'Algorithms', path: '/algorithms', icon: Cpu },
    { name: 'AI Tutor', path: '/tutor', icon: Bot },
    { name: 'Practice', path: '/practice', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-floral-white shadow-neu-raised rounded-b-2xl mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-floral-white shadow-neu-raised p-[1px] transition-all">
              <div className="w-full h-full rounded-[11px] flex items-center justify-center">
                <Atom className="w-6 h-6 text-slate-gray group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-black-olive flex items-center gap-1.5 text-base sm:text-lg">
                Quantum<span className="text-slate-gray">Platform</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-black-olive/70 font-mono -mt-1">
                Interactive EdTech
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'shadow-neu-pressed text-slate-gray'
                      : 'text-black-olive/70 hover:text-black-olive hover:shadow-neu-raised'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Backend Health indicator & CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-floral-white shadow-neu-pressed text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-black-olive/70" />
              <span className="text-black-olive/70 text-[11px]">Backend:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full shadow-neu-raised ${
                    backendOnline === true
                      ? 'bg-slate-gray animate-pulse'
                      : backendOnline === false
                      ? 'bg-black-olive'
                      : 'bg-black-olive/70 animate-ping'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    backendOnline === true
                      ? 'text-slate-gray'
                      : backendOnline === false
                      ? 'text-black-olive'
                      : 'text-black-olive/70'
                  }`}
                >
                  {backendOnline === true ? 'Qiskit Ready' : backendOnline === false ? 'Offline' : 'Connecting...'}
                </span>
              </div>
            </div>

            <Link
              to="/lab"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-gray text-floral-white text-xs font-semibold shadow-neu-raised transition-all hover:shadow-neu-pressed"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Launch Lab
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-floral-white shadow-neu-raised text-black-olive/70 hover:text-black-olive hover:shadow-neu-pressed"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-floral-white shadow-neu-pressed rounded-2xl mx-4 mt-2 mb-4 px-4 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                  isActive
                    ? 'shadow-neu-pressed text-slate-gray'
                    : 'text-black-olive/70 hover:shadow-neu-raised'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
