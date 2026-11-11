import React from 'react';
import { AgentProfile, TaskNode } from '../types/agent';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Terminal, 
  Zap, 
  Search, 
  Code2, 
  ShieldAlert, 
  Flame 
} from 'lucide-react';

interface AgentSwarmRosterProps {
  agents: AgentProfile[];
  nodes: TaskNode[];
}

export const AgentSwarmRoster: React.FC<AgentSwarmRosterProps> = ({ agents, nodes }) => {
  const getIcon = (avatar: string) => {
    switch (avatar) {
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-sky-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Lock': return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'Terminal': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Search': return <Search className="w-4 h-4 text-blue-400" />;
      case 'Code2': return <Code2 className="w-4 h-4 text-violet-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-rose-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-cyber-900/90 border border-cyber-700/80 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>Active Specialist Swarm</span>
          <span className="text-[10px] bg-cyber-800 text-sky-400 px-2 py-0.5 rounded-full border border-cyber-600 font-mono">
            {agents.length} Models
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {agents.map(agent => {
          const assignedRunningNode = nodes.find(
            n => n.assignedAgentId === agent.id && n.status === 'running'
          );
          const isBusy = !!assignedRunningNode;

          return (
            <div
              key={agent.id}
              className={`border rounded-lg p-3 transition-all ${
                isBusy 
                  ? 'bg-sky-950/30 border-sky-500/60 shadow-md shadow-sky-500/10' 
                  : 'bg-cyber-800/40 border-cyber-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-cyber-700/50">
                    {getIcon(agent.avatar)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{agent.name}</h4>
                    <span className="text-[10px] text-slate-400 capitalize">{agent.role.replace('_', ' ')}</span>
                  </div>
                </div>

                {isBusy ? (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" title="Executing task" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" title="Idle / Standby" />
                )}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 my-1.5">
                {agent.specialization}
              </p>

              <div className="pt-2 border-t border-cyber-700/40 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{agent.model}</span>
                <span className="text-emerald-400 font-semibold">{agent.confidenceScore}% Acc</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
