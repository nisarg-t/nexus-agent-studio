import React from 'react';
import { SwarmEvent } from '../types/agent';
import { Terminal, ShieldAlert, Cpu, Sparkles, CheckCircle2, Wrench } from 'lucide-react';

interface LiveReasoningFeedProps {
  events: SwarmEvent[];
}

export const LiveReasoningFeed: React.FC<LiveReasoningFeedProps> = ({ events }) => {
  const getEventBadge = (type: SwarmEvent['type']) => {
    switch (type) {
      case 'agent_thought':
        return (
          <span className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            <Cpu className="w-2.5 h-2.5" /> REASONING
          </span>
        );
      case 'tool_call':
        return (
          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
            <Wrench className="w-2.5 h-2.5" /> TOOL
          </span>
        );
      case 'node_completed':
        return (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            <CheckCircle2 className="w-2.5 h-2.5" /> RESOLVED
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
            <ShieldAlert className="w-2.5 h-2.5" /> ALERT
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
            <Sparkles className="w-2.5 h-2.5" /> SWARM
          </span>
        );
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-4 flex flex-col h-[400px]">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-700/70 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Live Swarm Reasoning Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {events.length} Telemetry Events
        </span>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-2 rounded bg-cyber-950/60 border border-cyber-800/60 flex items-start gap-2.5 hover:border-cyber-700 transition"
          >
            <span className="text-[10px] text-slate-500 whitespace-nowrap pt-0.5">
              {formatTimestamp(evt.timestamp)}
            </span>
            <div className="shrink-0">{getEventBadge(evt.type)}</div>
            <p className="text-slate-300 leading-relaxed break-words flex-1 text-[11px]">
              {evt.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
