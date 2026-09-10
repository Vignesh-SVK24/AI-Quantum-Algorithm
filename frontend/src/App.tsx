import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { QuantumBasics } from './pages/QuantumBasics';
import { QuantumLab } from './pages/QuantumLab';
import { AlgorithmLab } from './pages/AlgorithmLab';
import { AlgorithmPlayground } from './pages/AlgorithmPlayground';
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
          {/* Subtle Botanical Quantum Orbit Curves */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="botanical-quantum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A7B09A" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#8FBFC0" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#C5A86A" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path d="M-100,220 C350,120 650,420 1200,240 C1650,120 1950,320 2400,180" fill="none" stroke="url(#botanical-quantum-grad)" strokeWidth="1.5" />
            <path d="M-50,650 C420,520 780,720 1350,580 C1820,460 2150,640 2500,520" fill="none" stroke="url(#botanical-quantum-grad)" strokeWidth="1" strokeDasharray="6,6" />
          </svg>
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/basics" element={<QuantumBasics />} />
            <Route path="/lab" element={<QuantumLab />} />
            <Route path="/playground" element={<AlgorithmPlayground />} />
            <Route path="/playground/:algoId" element={<AlgorithmPlayground />} />
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
