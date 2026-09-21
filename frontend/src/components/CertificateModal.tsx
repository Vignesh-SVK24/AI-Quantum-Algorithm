import React, { useState } from 'react';
import { Award, CheckCircle2, Printer, X, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentName?: string;
  completedTier?: string;
  scorePercentage?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  defaultStudentName = '',
  completedTier = 'Full Quantum Curriculum Mastery',
  scorePercentage = 100
}) => {
  const [studentName, setStudentName] = useState(() => {
    if (defaultStudentName) return defaultStudentName;
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('userName');
      if (stored) return stored;
    }
    return 'Quantum Scholar';
  });
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const credentialId = `QC-${Math.abs(
    studentName.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase()}-VERIFIED`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-floral-white rounded-3xl shadow-2xl border border-[#E0D9C8] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#202C3D] text-[#FAF7EE] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Award className="w-4 h-4 text-[#C5A86A]" />
            <span className="font-bold tracking-wider uppercase">Official Achievement Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#C5A86A] text-[#151D29] text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#FAF7EE]/70 hover:text-[#FAF7EE] hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-[#FAF7EE] text-[#31372B] relative">
          {/* Ornate Botanical Border */}
          <div className="border-4 border-double border-[#C5A86A] p-8 sm:p-10 rounded-2xl relative bg-radial from-white to-[#FAF7EE] shadow-inner text-center space-y-6">
            
            {/* Corner Decorative Dots */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#C5A86A]" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C5A86A]" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#C5A86A]" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#C5A86A]" />

            {/* Header / Seal */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#202C3D] border-2 border-[#C5A86A] flex items-center justify-center text-[#C5A86A] shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#31372B]/60 font-bold">
                Quantum Algorithm Learning Platform • Verified Track
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#202C3D] tracking-tight">
                Certificate of Quantum Mastery
              </h2>
            </div>

            {/* Presentation Line */}
            <p className="text-xs sm:text-sm text-[#31372B]/75 italic font-serif">
              This official document certifies that
            </p>

            {/* Recipient Name (Click to edit) */}
            <div className="py-1">
              {isEditing ? (
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className="text-2xl sm:text-3xl font-bold text-center font-serif text-[#202C3D] border-b-2 border-[#C5A86A] bg-transparent outline-none px-4 py-1"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-2xl sm:text-3xl font-bold font-serif text-[#202C3D] border-b-2 border-dashed border-[#C5A86A]/70 hover:border-[#C5A86A] px-4 py-1 transition-all"
                  title="Click to edit name"
                >
                  {studentName || 'Click to enter your name'}
                </button>
              )}
            </div>

            {/* Achievement Description */}
            <p className="text-xs sm:text-sm text-[#31372B]/85 max-w-xl mx-auto leading-relaxed">
              has demonstrated distinguished competency in <strong>{completedTier}</strong>, exhibiting mastery over
              single-qubit rotations, multi-qubit entanglement, phase kickback, and statevector interference with a verified score threshold of <strong>{scorePercentage}%</strong>.
            </p>

            {/* Badges Earned Ribbon */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E0D9C8] text-[11px] font-mono font-bold text-[#202C3D] flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Foundations
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E0D9C8] text-[11px] font-mono font-bold text-[#202C3D] flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Quantum Circuits
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E0D9C8] text-[11px] font-mono font-bold text-[#202C3D] flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Algorithmic Oracles
              </span>
            </div>

            {/* Signatures & Verification Meta */}
            <div className="pt-6 border-t border-[#E0D9C8] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-serif italic text-sm text-[#202C3D]">
                  Quantum Curriculum Academic Advisory Committee
                </div>
                <div className="text-[10px] text-[#31372B]/60 font-mono">
                  Verified Simulation Engine (Qiskit Statevector v2.5)
                </div>
              </div>

              <div className="space-y-1 text-center sm:text-right font-mono text-[10px]">
                <div className="text-[#31372B]/60">Date of Award: <strong>{issueDate}</strong></div>
                <div className="text-[#202C3D] font-bold flex items-center justify-center sm:justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ID: {credentialId}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
