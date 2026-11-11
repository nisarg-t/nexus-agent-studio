import React, { useState, useEffect, useMemo } from 'react';
import { SwarmEngine, SwarmState } from './core/swarmEngine';
import { SCENARIOS } from './data/scenarios';
import { Navbar } from './components/Navbar';
import { TelemetryBar } from './components/TelemetryBar';
import { DagCanvas } from './components/DagCanvas';
import { AgentSwarmRoster } from './components/AgentSwarmRoster';
import { LiveReasoningFeed } from './components/LiveReasoningFeed';
import { ArtifactInspector } from './components/ArtifactInspector';
import { NodeDetailModal } from './components/NodeDetailModal';
import { ApiKeyModal } from './components/ApiKeyModal';

export const App: React.FC = () => {
  const initialScenario = SCENARIOS[0];

  const engine = useMemo(() => {
    return new SwarmEngine(
      initialScenario.id,
      initialScenario.name,
      initialScenario.nodes,
      initialScenario.agents,
      initialScenario.initialArtifacts
    );
  }, []);

  const [state, setState] = useState<SwarmState>(engine.getState());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [detailModalNodeId, setDetailModalNodeId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = engine.subscribe(newState => {
      setState({ ...newState });
    });
    return () => unsubscribe();
  }, [engine]);

  const handleSelectNode = (nodeId: string) => {
    engine.selectNode(nodeId);
    setDetailModalNodeId(nodeId);
  };

  return (
    <div className="min-h-screen bg-cyber-950 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation */}
      <Navbar
        engine={engine}
        state={state}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Real-Time Telemetry Observability */}
      <TelemetryBar
        telemetry={state.telemetry}
        isRunning={state.isRunning}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-5 space-y-5">
        
        {/* Scenario Header Info */}
        <div className="bg-cyber-900/60 border border-cyber-700/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-sky-950 text-sky-400 border border-sky-800">
                {state.scenarioName}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                {state.nodes.length} Task Nodes in DAG
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              {SCENARIOS.find(s => s.id === state.scenarioId)?.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              state.isRunning 
                ? 'bg-sky-950/80 text-sky-400 border-sky-700' 
                : state.isCompleted
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                : 'bg-cyber-800 text-slate-400 border-cyber-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                state.isRunning ? 'bg-sky-400 animate-pulse' : state.isCompleted ? 'bg-emerald-400' : 'bg-slate-500'
              }`} />
              {state.isRunning ? 'SWARM EXECUTING' : state.isCompleted ? 'DAG RESOLVED' : 'STANDBY READY'}
            </span>
          </div>
        </div>

        {/* Interactive DAG Visualizer */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Execution Directed Acyclic Graph (DAG)
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Click any node to inspect telemetry & tool calls
            </span>
          </div>
          <DagCanvas
            nodes={state.nodes}
            agents={state.agents}
            selectedNodeId={state.selectedNodeId}
            onSelectNode={handleSelectNode}
          />
        </section>

        {/* Active Specialist Swarm Roster */}
        <section>
          <AgentSwarmRoster
            agents={state.agents}
            nodes={state.nodes}
          />
        </section>

        {/* Dual Live Panels: Reasoning Terminal & Synthesized Artifacts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LiveReasoningFeed events={state.events} />
          <ArtifactInspector
            artifacts={state.artifacts}
            selectedArtifactId={state.selectedArtifactId}
            onSelectArtifact={(id) => engine.selectArtifact(id)}
          />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-800 bg-cyber-900/60 py-4 px-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Nexus AgentStudio — Portfolio Open-Source Architecture Project</span>
          <span className="font-mono text-[11px] text-slate-400">
            MIT License • Clean Architecture & Zero-Config Simulation
          </span>
        </div>
      </footer>

      {/* Modals */}
      <NodeDetailModal
        nodeId={detailModalNodeId}
        nodes={state.nodes}
        agents={state.agents}
        onClose={() => setDetailModalNodeId(null)}
      />

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={state.apiKey}
        useLiveLlm={state.useLiveLlm}
        onSave={(key, useLive) => engine.setApiKey(key, useLive)}
      />
    </div>
  );
};
