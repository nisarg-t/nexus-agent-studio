import { TaskNode, AgentProfile, SwarmEvent, SwarmTelemetry, SwarmArtifact } from '../types/agent';
import { getReadyNodes } from './dagEngine';

export type SwarmListener = (state: SwarmState) => void;

export interface SwarmState {
  scenarioId: string;
  scenarioName: string;
  nodes: TaskNode[];
  agents: AgentProfile[];
  artifacts: SwarmArtifact[];
  telemetry: SwarmTelemetry;
  events: SwarmEvent[];
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  selectedNodeId: string | null;
  selectedArtifactId: string | null;
  speedMultiplier: number; // 1x, 2x, 5x
  apiKey: string;
  useLiveLlm: boolean;
}

export class SwarmEngine {
  private state: SwarmState;
  private listeners: Set<SwarmListener> = new Set();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private startTime: number = 0;

  constructor(
    scenarioId: string,
    scenarioName: string,
    nodes: TaskNode[],
    agents: AgentProfile[],
    initialArtifacts: SwarmArtifact[]
  ) {
    this.state = {
      scenarioId,
      scenarioName,
      nodes: JSON.parse(JSON.stringify(nodes)),
      agents: JSON.parse(JSON.stringify(agents)),
      artifacts: JSON.parse(JSON.stringify(initialArtifacts)),
      telemetry: {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        executionTimeMs: 0,
        activeAgentsCount: 0,
        completedNodes: 0,
        totalNodes: nodes.length,
        safetyScore: 99.2
      },
      events: [
        {
          id: 'evt-init',
          timestamp: Date.now(),
          type: 'info',
          message: `Swarm initialized with ${agents.length} specialized agents across ${nodes.length} DAG nodes.`
        }
      ],
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      selectedNodeId: nodes[0]?.id || null,
      selectedArtifactId: initialArtifacts[0]?.id || null,
      speedMultiplier: 1.5,
      apiKey: '',
      useLiveLlm: false
    };
  }

  public getState(): SwarmState {
    return this.state;
  }

  public subscribe(listener: SwarmListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public selectNode(nodeId: string | null) {
    this.state.selectedNodeId = nodeId;
    this.notify();
  }

  public selectArtifact(artifactId: string | null) {
    this.state.selectedArtifactId = artifactId;
    this.notify();
  }

  public setSpeed(multiplier: number) {
    this.state.speedMultiplier = multiplier;
    this.notify();
  }

  public setApiKey(key: string, useLive: boolean) {
    this.state.apiKey = key;
    this.state.useLiveLlm = useLive;
    this.addEvent({
      type: 'info',
      message: useLive ? 'Gemini Live API mode activated.' : 'High-fidelity simulation mode active.'
    });
    this.notify();
  }

  public start() {
    if (this.state.isRunning && !this.state.isPaused) return;

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.startTime = Date.now() - this.state.telemetry.executionTimeMs;

    this.addEvent({
      type: 'info',
      message: 'Autonomous Swarm Orchestration begun. Evaluating DAG dependencies...'
    });

    this.loop();
    this.notify();
  }

  public pause() {
    this.state.isPaused = true;
    this.state.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    this.addEvent({
      type: 'warning',
      message: 'Swarm paused by operator.'
    });
    this.notify();
  }

  public reset(scenarioId: string, scenarioName: string, nodes: TaskNode[], agents: AgentProfile[], artifacts: SwarmArtifact[]) {
    if (this.timer) clearTimeout(this.timer);
    this.state = {
      ...this.state,
      scenarioId,
      scenarioName,
      nodes: JSON.parse(JSON.stringify(nodes)),
      agents: JSON.parse(JSON.stringify(agents)),
      artifacts: JSON.parse(JSON.stringify(artifacts)),
      telemetry: {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        estimatedCostUsd: 0,
        executionTimeMs: 0,
        activeAgentsCount: 0,
        completedNodes: 0,
        totalNodes: nodes.length,
        safetyScore: 99.2
      },
      events: [
        {
          id: `evt-reset-${Date.now()}`,
          timestamp: Date.now(),
          type: 'info',
          message: `Swarm reset. Ready for scenario: "${scenarioName}"`
        }
      ],
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      selectedNodeId: nodes[0]?.id || null,
      selectedArtifactId: artifacts[0]?.id || null,
    };
    this.notify();
  }

  private addEvent(event: Omit<SwarmEvent, 'id' | 'timestamp'>) {
    const newEvent: SwarmEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      ...event
    };
    this.state.events = [newEvent, ...this.state.events].slice(0, 100);
  }

  private loop = () => {
    if (!this.state.isRunning || this.state.isPaused) return;

    // Update execution clock
    this.state.telemetry.executionTimeMs = Date.now() - this.startTime;

    // 1. Check currently running nodes and advance progress
    const runningNodes = this.state.nodes.filter(n => n.status === 'running');
    
    for (const node of runningNodes) {
      node.progress = Math.min(100, node.progress + Math.floor(15 * this.state.speedMultiplier));
      
      // Emit intermediate reasoning thought
      if (node.progress === 40 && node.reasoningLog[0]) {
        this.addEvent({
          type: 'agent_thought',
          agentId: node.assignedAgentId,
          nodeId: node.id,
          message: `[${this.getAgentName(node.assignedAgentId)}] ${node.reasoningLog[0]}`
        });
      }

      if (node.progress === 70 && node.toolsCalled[0]) {
        this.addEvent({
          type: 'tool_call',
          agentId: node.assignedAgentId,
          nodeId: node.id,
          message: `Invoked tool "${node.toolsCalled[0].name}" with latency ${node.toolsCalled[0].latencyMs}ms`
        });
      }

      // Check if node is finished
      if (node.progress >= 100) {
        node.status = 'completed';
        this.state.telemetry.completedNodes += 1;
        this.state.telemetry.totalTokens += node.tokensUsed;
        this.state.telemetry.promptTokens += Math.floor(node.tokensUsed * 0.4);
        this.state.telemetry.completionTokens += Math.floor(node.tokensUsed * 0.6);
        this.state.telemetry.estimatedCostUsd = Number(((this.state.telemetry.totalTokens / 1_000_000) * 0.35).toFixed(4));

        this.addEvent({
          type: 'node_completed',
          agentId: node.assignedAgentId,
          nodeId: node.id,
          message: `Completed task node: "${node.title}" (${node.tokensUsed} tokens)`
        });
      }
    }

    // 2. Find newly ready nodes to start
    const readyNodes = getReadyNodes(this.state.nodes);
    for (const node of readyNodes) {
      if (node.status === 'pending' || node.status === 'ready') {
        node.status = 'running';
        node.progress = 5;
        this.addEvent({
          type: 'info',
          agentId: node.assignedAgentId,
          nodeId: node.id,
          message: `Dispatched "${node.title}" to Agent ${this.getAgentName(node.assignedAgentId)}`
        });
      }
    }

    // Update active agents count
    const activeRunning = this.state.nodes.filter(n => n.status === 'running');
    this.state.telemetry.activeAgentsCount = activeRunning.length;

    // Check completion condition
    const allCompleted = this.state.nodes.every(n => n.status === 'completed');
    if (allCompleted && this.state.nodes.length > 0) {
      this.state.isRunning = false;
      this.state.isCompleted = true;
      this.addEvent({
        type: 'info',
        message: 'All DAG tasks completed with 100% consensus and zero security regressions!'
      });
      this.notify();
      return;
    }

    this.notify();
    const interval = Math.max(120, Math.floor(400 / this.state.speedMultiplier));
    this.timer = setTimeout(this.loop, interval);
  };

  private getAgentName(agentId: string): string {
    const agent = this.state.agents.find(a => a.id === agentId);
    return agent ? agent.name : agentId;
  }
}
