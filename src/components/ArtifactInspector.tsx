import React, { useState } from 'react';
import { SwarmArtifact } from '../types/agent';
import { FileCode, Copy, Check, FileText } from 'lucide-react';

interface ArtifactInspectorProps {
  artifacts: SwarmArtifact[];
  selectedArtifactId: string | null;
  onSelectArtifact: (id: string) => void;
}

export const ArtifactInspector: React.FC<ArtifactInspectorProps> = ({
  artifacts,
  selectedArtifactId,
  onSelectArtifact,
}) => {
  const [copied, setCopied] = useState(false);

  const activeArtifact = artifacts.find(a => a.id === selectedArtifactId) || artifacts[0];

  const handleCopy = () => {
    if (activeArtifact) {
      navigator.clipboard.writeText(activeArtifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-4 flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-700/70 mb-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Synthesized Artifacts
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1">
          {artifacts.map(art => (
            <button
              key={art.id}
              onClick={() => onSelectArtifact(art.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition font-mono ${
                activeArtifact?.id === art.id
                  ? 'bg-cyber-700 text-sky-400 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-800'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{art.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Preview */}
      {activeArtifact ? (
        <div className="relative flex-1 bg-cyber-950/80 border border-cyber-800/80 rounded-lg p-3 overflow-auto flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-cyber-800/60 text-[10px] text-slate-400 font-mono">
            <span>Author: {activeArtifact.generatedByAgent}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyber-800 hover:bg-cyber-700 text-slate-200 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="flex-1 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed select-text">
            {activeArtifact.content}
          </pre>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
          No artifacts generated yet. Execute swarm to trigger synthesis.
        </div>
      )}
    </div>
  );
};
