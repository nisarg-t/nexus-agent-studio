import React from 'react';
import { TaskNode, AgentProfile } from '../types/agent';
import { X, Wrench, Clock, CheckCircle2, Cpu } from 'lucide-react';

interface NodeDetailModalProps {
  nodeId: string | null;
  nodes: TaskNode[];
  agents: AgentProfile[];
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  nodeId,
  nodes,
  agents,
  onClose
}) => {
  if (!nodeId) return null;
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const agent = agents.find(a => a.id === node.assignedAgentId);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cyber-900 border border-cyber-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-700 bg-cyber-800/50">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{node.title}</h3>
              <span className="text-[11px] text-slate-400 font-mono">Node ID: {node.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status & Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cyber-800/40 border border-cyber-700/60 p-2.5 rounded-lg">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Assigned Agent</span>
              <span className="text-xs font-semibold text-sky-400">{agent ? agent.name : 'None'}</span>
            </div>
            <div className="bg-cyber-800/40 border border-cyber-700/60 p-2.5 rounded-lg">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Execution Status</span>
              <span className="text-xs font-semibold uppercase text-emerald-400">{node.status}</span>
            </div>
            <div className="bg-cyber-800/40 border border-cyber-700/60 p-2.5 rounded-lg">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Token Consumption</span>
              <span className="text-xs font-mono font-semibold text-slate-100">{node.tokensUsed} Tokens</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Objective & Scope
            </h4>
            <p className="text-xs text-slate-300 bg-cyber-950/60 p-3 rounded-lg border border-cyber-800 leading-relaxed">
              {node.description}
            </p>
          </div>

          {/* Tools Called */}
          {node.toolsCalled.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" /> Tool Invocations
              </h4>
              <div className="space-y-2">
                {node.toolsCalled.map(tool => (
                  <div key={tool.id} className="bg-cyber-950/80 border border-cyber-800 p-2.5 rounded-lg font-mono text-xs">
                    <div className="flex items-center justify-between text-amber-400 mb-1">
                      <span className="font-semibold">{tool.name}()</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tool.latencyMs}ms
                      </span>
                    </div>
                    <pre className="text-[11px] text-slate-400 overflow-x-auto whitespace-pre">
                      {JSON.stringify(tool.params, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Trail */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Chain-of-Thought Trail
            </h4>
            <div className="bg-cyber-950/80 border border-cyber-800 rounded-lg p-3 space-y-2 font-mono text-xs">
              {node.reasoningLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-sky-400 select-none">&gt;</span>
                  <span className="text-[11px] leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
