import React from 'react';
import { Atom, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-floral-white shadow-neu-raised py-12 text-black-olive/70 text-sm mt-auto rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-black-olive font-semibold">
              <Atom className="w-5 h-5 text-slate-gray" />
              <span>Quantum Algorithm Learning Platform</span>
            </div>
            <p className="text-black-olive/70 text-xs leading-relaxed max-w-sm">
              A rigorous pedagogical framework designed to teach quantum circuits, superposition, entanglement,
              and quantum algorithmic speedups through hands-on interaction and live simulation.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-black-olive/70">
              <span>Powered by Qiskit Statevector Simulator</span>
              <span>•</span>
              <span>FastAPI</span>
              <span>•</span>
              <span>React 19</span>
            </div>
          </div>

          <div>
            <h4 className="text-black-olive text-xs font-semibold uppercase tracking-wider mb-3">Curriculum</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/basics" className="hover:text-slate-gray transition-colors">Quantum Basics</Link></li>
              <li><Link to="/lab" className="hover:text-slate-gray transition-colors">Interactive Circuit Lab</Link></li>
              <li><Link to="/algorithms" className="hover:text-slate-gray transition-colors">Algorithm Explorer</Link></li>
              <li><Link to="/practice" className="hover:text-slate-gray transition-colors">Practice Exercises</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black-olive text-xs font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tutor" className="hover:text-slate-gray transition-colors">AI Quantum Tutor</Link></li>
              <li><Link to="/dashboard" className="hover:text-slate-gray transition-colors">Student Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-slate-gray transition-colors">About & Methodology</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-black-olive/70">
          <p>© {new Date().getFullYear()} Quantum Algorithm Learning Platform. Academic & Open Educational Resource.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Learn → Build → Simulate → Visualize → Understand
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
