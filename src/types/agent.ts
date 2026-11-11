export type AgentRole = 
  | 'orchestrator'
  | 'researcher'
  | 'architect'
  | 'security_auditor'
  | 'synthesizer'
  | 'code_specialist';

export type AgentStatus = 'idle' | 'thinking' | 'executing' | 'verifying' | 'completed' | 'failed';

export interface AgentProfile {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  model: string;
  specialization: string;
  confidenceScore: number;
  temperature: number;
  systemPrompt: string;
}

export type TaskStatus = 'pending' | 'ready' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ToolCall {
  id: string;
  name: string;
  params: Record<string, unknown>;
  output?: string;
  latencyMs: number;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string;
  status: TaskStatus;
  dependencies: string[]; // list of node IDs that must be completed first
  input?: string;
  output?: string;
  reasoningLog: string[];
  toolsCalled: ToolCall[];
  durationMs: number;
  tokensUsed: number;
  progress: number; // 0 to 100
}

export interface SwarmArtifact {
  id: string;
  title: string;
  type: 'code' | 'markdown' | 'json' | 'diff' | 'config';
  language?: string;
  content: string;
  generatedByAgent: string;
  timestamp: string;
}

export interface SwarmScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  agents: AgentProfile[];
  nodes: TaskNode[];
  initialArtifacts: SwarmArtifact[];
}

export interface SwarmTelemetry {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  executionTimeMs: number;
  activeAgentsCount: number;
  completedNodes: number;
  totalNodes: number;
  safetyScore: number; // 0 to 100
}

export interface SwarmEvent {
  id: string;
  timestamp: number;
  agentId?: string;
  nodeId?: string;
  type: 'info' | 'agent_thought' | 'tool_call' | 'node_completed' | 'artifact_created' | 'warning' | 'error';
  message: string;
  details?: unknown;
}
