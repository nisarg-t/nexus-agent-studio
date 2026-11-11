import React, { useMemo } from 'react';
import { TaskNode, AgentProfile } from '../types/agent';
import { computeExecutionLayers } from '../core/dagEngine';
import { Check, Clock, Play, Wrench, ShieldAlert } from 'lucide-react';

interface DagCanvasProps {
  nodes: TaskNode[];
  agents: AgentProfile[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export const DagCanvas: React.FC<DagCanvasProps> = ({
  nodes,
  agents,
  selectedNodeId,
  onSelectNode
}) => {
  const agentMap = useMemo(() => new Map(agents.map(a => [a.id, a])), [agents]);

  // Compute layers to position nodes neatly horizontally or vertically
  const layers = useMemo(() => computeExecutionLayers(nodes), [nodes]);

  // Map each node to (x, y) coordinates
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number; layerIdx: number; rowIdx: number }>();
    const layerSpacingX = 260;
    const nodeSpacingY = 160;

    layers.forEach((layer, layerIdx) => {
      const startY = 60 + ((Math.max(...layers.map(l => l.length)) - layer.length) * nodeSpacingY) / 2;
      layer.forEach((nodeId, rowIdx) => {
        positions.set(nodeId, {
          x: 40 + layerIdx * layerSpacingX,
          y: startY + rowIdx * nodeSpacingY,
          layerIdx,
          rowIdx
        });
      });
    });

    return positions;
  }, [layers]);

  // Collect all edges from dependencies
  const edges = useMemo(() => {
    const list: { fromId: string; toId: string; isActive: boolean; isCompleted: boolean }[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const depNode = nodeMap.get(depId);
        const isActive = depNode?.status === 'running' || node.status === 'running';
        const isCompleted = depNode?.status === 'completed';
        list.push({ fromId: depId, toId: node.id, isActive, isCompleted });
      });
    });

    return list;
  }, [nodes]);

  const canvasWidth = Math.max(800, 80 + layers.length * 270);
  const canvasHeight = Math.max(500, 120 + Math.max(...layers.map(l => l.length), 1) * 160);

  return (
    <div className="relative w-full h-[540px] bg-cyber-950/80 border border-cyber-700/80 rounded-xl overflow-auto select-none p-4 shadow-inner">
      
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div 
        className="relative"
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      >
        {/* SVG Bezier Curves for Dependencies */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        >
          <defs>
            <linearGradient id="edge-active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {edges.map((edge, idx) => {
            const p1 = nodePositions.get(edge.fromId);
            const p2 = nodePositions.get(edge.toId);
            if (!p1 || !p2) return null;

            // Connect from right of p1 to left of p2
            const startX = p1.x + 210;
            const startY = p1.y + 45;
            const endX = p2.x;
            const endY = p2.y + 45;
            const controlPointX1 = startX + 60;
            const controlPointX2 = endX - 60;

            const pathData = `M ${startX} ${startY} C ${controlPointX1} ${startY}, ${controlPointX2} ${endY}, ${endX} ${endY}`;

            return (
              <g key={`edge-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={edge.isCompleted ? '#0284c7' : '#334155'}
                  strokeWidth={edge.isActive ? 2.5 : 1.5}
                  strokeDasharray={edge.isActive ? '6 6' : undefined}
                  className={edge.isActive ? 'animate-pulse' : ''}
                  filter={edge.isActive ? 'url(#glow-edge)' : undefined}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;

          const isSelected = selectedNodeId === node.id;
          const assignedAgent = agentMap.get(node.assignedAgentId);

          let statusBg = 'bg-cyber-900/90 border-cyber-700/80 text-slate-300';
          let statusBadge = (
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" /> Pending
            </span>
          );

          if (node.status === 'running') {
            statusBg = 'bg-cyber-900 border-sky-500 text-sky-100 ring-2 ring-sky-500/30 shadow-lg shadow-sky-500/20';
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-sky-400 font-mono font-semibold animate-pulse">
                <Play className="w-3 h-3 fill-current" /> Running {node.progress}%
              </span>
            );
          } else if (node.status === 'completed') {
            statusBg = 'bg-cyber-900/90 border-emerald-500/80 text-emerald-100 shadow-sm shadow-emerald-500/10';
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-semibold">
                <Check className="w-3 h-3" /> Completed
              </span>
            );
          } else if (node.status === 'failed') {
            statusBg = 'bg-cyber-900 border-rose-500 text-rose-100';
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-rose-400 font-mono">
                <ShieldAlert className="w-3 h-3" /> Error
              </span>
            );
          }

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: '210px',
              }}
              className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 backdrop-blur-sm ${statusBg} ${
                isSelected ? 'ring-2 ring-white/60 shadow-xl' : ''
              }`}
            >
              {/* Header: Status and Token count */}
              <div className="flex items-center justify-between mb-1.5">
                {statusBadge}
                <span className="text-[10px] font-mono text-slate-400">
                  {node.tokensUsed > 0 ? `${node.tokensUsed} tkn` : ''}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-xs font-semibold leading-snug line-clamp-2 text-white mb-2">
                {node.title}
              </h4>

              {/* Progress bar if running */}
              {node.status === 'running' && (
                <div className="w-full h-1 bg-cyber-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              )}

              {/* Agent Attribution & Tool Indicator */}
              <div className="pt-2 border-t border-cyber-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[120px] font-medium text-slate-300">
                  {assignedAgent ? assignedAgent.name : 'Unassigned'}
                </span>

                {node.toolsCalled.length > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                    <Wrench className="w-2.5 h-2.5" /> {node.toolsCalled.length}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
