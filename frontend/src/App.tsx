import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <HashRouter>
      <div className="min-h-screen flex flex-col relative text-black-olive">
        {/* Decorative Background Video Layer */}
        <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none overflow-hidden" aria-hidden="true">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src={`${import.meta.env.BASE_URL}video/Animate_this_image.mp4`} type="video/mp4" />
            <source src="./video/Animate_this_image.mp4" type="video/mp4" />
            <source src="/video/Animate_this_image.mp4" type="video/mp4" />
          </video>
          {/* Subtle overlay ensuring existing content remains readable without changing visual identity */}
          <div className="absolute inset-0 bg-[#FAF7EE]/80" />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">
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
    </HashRouter>
  );
};

export default App;
