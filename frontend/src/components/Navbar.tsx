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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-quantum-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-quantum-500 to-teal-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-cyan-400/30 transition-all">
              <div className="w-full h-full bg-quantum-950 rounded-[11px] flex items-center justify-center">
                <Atom className="w-6 h-6 text-teal-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base sm:text-lg">
                Quantum<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-400">Platform</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono -mt-1">
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
                  className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-teal-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Backend Health indicator & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Backend:</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline === true
                      ? 'bg-emerald-400 animate-pulse'
                      : backendOnline === false
                      ? 'bg-rose-500'
                      : 'bg-amber-400 animate-ping'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    backendOnline === true
                      ? 'text-emerald-400'
                      : backendOnline === false
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {backendOnline === true ? 'Qiskit Ready' : backendOnline === false ? 'Offline' : 'Connecting...'}
                </span>
              </div>
            </div>

            <Link
              to="/lab"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-400 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Launch Lab
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-quantum-900/95 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-indigo-600/20 text-teal-300'
                    : 'text-slate-300 hover:bg-slate-800/40'
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
