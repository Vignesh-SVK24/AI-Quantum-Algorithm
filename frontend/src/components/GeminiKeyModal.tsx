import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, Loader2, X, ExternalLink, Trash2 } from 'lucide-react';
import { getStoredGeminiApiKey, setStoredGeminiApiKey, removeStoredGeminiApiKey, testGeminiApiKey } from '../services/api';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredGeminiApiKey();
      setApiKey(stored || '');
      setHasExistingKey(!!stored);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setStatusMessage({ type: 'error', text: 'Please paste your Gemini API key.' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);
    try {
      const res = await testGeminiApiKey(trimmed);
      if (res.success) {
        setStoredGeminiApiKey(trimmed);
        setHasExistingKey(true);
        setStatusMessage({ type: 'success', text: res.message });
        onKeyUpdated?.();
        setTimeout(() => onClose(), 1200);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = () => {
    removeStoredGeminiApiKey();
    setApiKey('');
    setHasExistingKey(false);
    setStatusMessage({ type: 'success', text: 'API key removed. Running in offline educational mode.' });
    onKeyUpdated?.();
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-deep-slate border border-soft-slate/50 text-floral-white shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-warm-ivory/60 hover:text-warm-ivory hover:bg-slate-glow transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-glow border border-soft-cyan/40 text-soft-cyan flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-floral-white">Connect Google Gemini API</h3>
            <p className="text-[11px] text-warm-ivory/70">Enable real-time AI reasoning on GitHub Pages</p>
          </div>
        </div>

        <p className="text-xs text-warm-ivory/80 leading-relaxed">
          On static GitHub Pages deployments, you can connect your Google Gemini API key to ask questions dynamically with multi-turn AI reasoning.
        </p>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-warm-ivory/70 flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-cyan hover:underline flex items-center gap-1 text-[10px]"
            >
              Get a free key <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy... (from Google AI Studio)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-glow border border-soft-slate/50 text-floral-white placeholder:text-warm-ivory/40 text-xs focus:outline-none focus:border-soft-cyan transition-all"
          />
          <p className="text-[10px] text-warm-ivory/60 leading-relaxed">
            💡 Google Gemini API keys start with <span className="text-soft-cyan font-mono font-bold">AIzaSy...</span>. Tokens starting with <span className="font-mono text-warm-gold font-bold">AQ.</span> are internal developer tokens. Your AI Tutor works seamlessly in both modes!
          </p>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-muted-sage/20 border border-muted-sage/40 text-muted-sage'
              : 'bg-soft-cocoa/30 border border-soft-cocoa/50 text-warm-gold'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {hasExistingKey ? (
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-warm-gold hover:bg-soft-cocoa/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Disconnect
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-warm-ivory/70 hover:text-floral-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={testing || !apiKey.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-soft-cyan text-black-olive font-bold text-xs shadow-md hover:bg-soft-cyan/90 transition-all disabled:opacity-50"
            >
              {testing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{testing ? 'Testing...' : 'Test & Connect'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
