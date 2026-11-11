import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  useLiveLlm: boolean;
  onSave: (key: string, useLive: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  useLiveLlm,
  onSave
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [toggleLive, setToggleLive] = useState(useLiveLlm);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputKey, toggleLive);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-cyber-700 bg-cyber-800/50">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">LLM Provider Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            By default, <strong>Nexus AgentStudio</strong> runs in a high-fidelity deterministic simulation mode with zero cost and no API keys required. You can optionally connect your Google Gemini API key below to query live models in real time.
          </p>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1 uppercase tracking-wider">
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-cyber-950/60 border border-cyber-800 rounded-lg">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Live Gemini API Calls</span>
              <span className="text-[10px] text-slate-400">Stream live generations from gemini-1.5-pro/flash</span>
            </div>
            <input
              type="checkbox"
              checked={toggleLive}
              onChange={(e) => setToggleLive(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-0 bg-cyber-800 border-cyber-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 flex items-start gap-2.5 text-xs text-sky-300">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>Keys are stored strictly in client memory and never transmitted to external servers.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
