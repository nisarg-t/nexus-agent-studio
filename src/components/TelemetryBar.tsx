import React from 'react';
import { 
  Activity, 
  Cpu, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle 
} from 'lucide-react';
import { SwarmTelemetry } from '../types/agent';

interface TelemetryBarProps {
  telemetry: SwarmTelemetry;
  isRunning: boolean;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry, isRunning }) => {
  const formatTime = (ms: number) => {
    const sec = (ms / 1000).toFixed(1);
    return `${sec}s`;
  };

  return (
    <div className="bg-cyber-900 border-b border-cyber-700/80 px-5 py-2.5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Token Counter */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-sky-500/10 text-sky-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Tokens</div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {telemetry.totalTokens.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Estimated Cost</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              ${telemetry.estimatedCostUsd.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Execution Clock */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Execution Latency</div>
            <div className="text-sm font-bold font-mono text-slate-100 flex items-center gap-1.5">
              <span>{formatTime(telemetry.executionTimeMs)}</span>
              {isRunning && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          </div>
        </div>

        {/* Active Concurrency */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Concurrent Agents</div>
            <div className="text-sm font-bold font-mono text-cyan-400">
              {telemetry.activeAgentsCount} Active
            </div>
          </div>
        </div>

        {/* DAG Progress */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-purple-500/10 text-purple-400">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">DAG Resolved</div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {telemetry.completedNodes} / {telemetry.totalNodes}
            </div>
          </div>
        </div>

        {/* Safety & Consensus */}
        <div className="bg-cyber-800/40 border border-cyber-700/60 rounded-lg p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Safety Score</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {telemetry.safetyScore}% Verified
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
