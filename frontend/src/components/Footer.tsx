import React from 'react';
import { Atom, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black-olive text-floral-white/85 py-12 text-sm mt-auto border-t border-deep-olive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-floral-white font-semibold">
              <div className="w-9 h-9 rounded-xl bg-deep-olive flex items-center justify-center border border-olive-mist/30">
                <Atom className="w-5 h-5 text-warm-gold" />
              </div>
              <span className="text-lg tracking-tight font-bold">Quantum Platform</span>
            </div>
            <p className="text-floral-white/80 text-sm leading-relaxed max-w-md">
              An interactive visual environment for learning quantum circuits, superposition, and algorithms through real-time simulation and guided AI assistance.
            </p>
          </div>

          <div>
            <h4 className="text-warm-gold text-sm font-semibold uppercase tracking-wider mb-3">Curriculum</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/basics" className="hover:text-floral-white text-floral-white/80 transition-colors">Quantum Basics</Link></li>
              <li><Link to="/lab" className="hover:text-floral-white text-floral-white/80 transition-colors">Interactive Circuit Lab</Link></li>
              <li><Link to="/algorithms" className="hover:text-floral-white text-floral-white/80 transition-colors">Algorithm Explorer</Link></li>
              <li><Link to="/practice" className="hover:text-floral-white text-floral-white/80 transition-colors">Practice Exercises</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-warm-gold text-sm font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/tutor" className="hover:text-floral-white text-floral-white/80 transition-colors">AI Quantum Tutor</Link></li>
              <li><Link to="/dashboard" className="hover:text-floral-white text-floral-white/80 transition-colors">Student Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-floral-white text-floral-white/80 transition-colors">About & Documentation</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-deep-olive flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-floral-white/70">
          <p>© {new Date().getFullYear()} Quantum Platform. Open Interactive Educational Resource.</p>
          <div className="flex items-center gap-4 text-warm-ivory/80">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-4 h-4 text-warm-gold" /> Learn → Build → Simulate → Understand
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
