import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Key, 
  Layers, 
  Sparkles,
  Github,
  CheckCircle2
} from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { SwarmEngine, SwarmState } from '../core/swarmEngine';

interface NavbarProps {
  engine: SwarmEngine;
  state: SwarmState;
  onOpenKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ engine, state, onOpenKeyModal }) => {
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SCENARIOS.find(s => s.id === e.target.value);
    if (selected) {
      engine.reset(
        selected.id,
        selected.name,
        selected.nodes,
        selected.agents,
        selected.initialArtifacts
      );
    }
  };

  return (
    <header className="border-b border-cyber-700 bg-cyber-900/90 backdrop-blur-md sticky top-0 z-40 px-5 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-white shadow-lg shadow-sky-500/20">
            <Layers className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Nexus <span className="text-sky-400 font-mono">AgentStudio</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/50">
                v1.0-Release
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Multi-Agent DAG Orchestrator & Live Swarm Observability
            </p>
          </div>
        </div>

        {/* Center: Scenario Selector & Playback Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Scenario Select */}
          <div className="flex items-center gap-1.5 bg-cyber-800/80 border border-cyber-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <select 
              value={state.scenarioId}
              onChange={handleScenarioChange}
              disabled={state.isRunning}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              {SCENARIOS.map(sc => (
                <option key={sc.id} value={sc.id} className="bg-cyber-900 text-slate-200">
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 bg-cyber-800/80 border border-cyber-600 rounded-lg p-1">
            {!state.isRunning ? (
              <button
                onClick={() => engine.start()}
                className="flex items-center gap-1.5 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Swarm</span>
              </button>
            ) : (
              <button
                onClick={() => engine.pause()}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => {
                const sc = SCENARIOS.find(s => s.id === state.scenarioId) || SCENARIOS[0];
                engine.reset(sc.id, sc.name, sc.nodes, sc.agents, sc.initialArtifacts);
              }}
              title="Reset Swarm State"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-cyber-700 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Multiplier */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-cyber-800/60 border border-cyber-700 rounded-lg px-2 py-1">
            {[1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => engine.setSpeed(speed)}
                className={`px-1.5 py-0.5 rounded transition ${
                  state.speedMultiplier === speed 
                    ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40' 
                    : 'hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Controls: API Key & Portfolio GitHub Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-cyber-800/70 border border-cyber-600 px-2.5 py-1.5 rounded-lg transition"
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">
              {state.useLiveLlm ? 'Gemini Live' : 'Simulated Sandbox'}
            </span>
            {state.useLiveLlm && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>

          <a
            href="https://github.com/nisarg-t/nexus-agent-studio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-cyber-800/70 border border-cyber-600 px-2.5 py-1.5 rounded-lg transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-mono">GitHub</span>
          </a>
        </div>

      </div>
    </header>
  );
};
