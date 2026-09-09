import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { QuantumBasics } from './pages/QuantumBasics';
import { QuantumLab } from './pages/QuantumLab';
import { AlgorithmLab } from './pages/AlgorithmLab';
import { AITutor } from './pages/AITutor';
import { Practice } from './pages/Practice';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-quantum-950 text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/basics" element={<QuantumBasics />} />
            <Route path="/lab" element={<QuantumLab />} />
            <Route path="/algorithms" element={<AlgorithmLab />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
