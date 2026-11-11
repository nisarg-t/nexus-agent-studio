import { describe, it, expect } from 'vitest';
import { validateDag, getReadyNodes, computeExecutionLayers } from '../src/core/dagEngine';
import { TaskNode } from '../src/types/agent';

describe('DAG Engine - Core Graph Orchestration', () => {
  const createMockNode = (id: string, deps: string[], status: TaskNode['status'] = 'pending'): TaskNode => ({
    id,
    title: `Task ${id}`,
    description: `Description for ${id}`,
    assignedAgentId: 'agent-1',
    status,
    dependencies: deps,
    reasoningLog: [],
    toolsCalled: [],
    durationMs: 0,
    tokensUsed: 0,
    progress: 0,
  });

  it('successfully validates a valid linear DAG', () => {
    const nodes: TaskNode[] = [
      createMockNode('A', []),
      createMockNode('B', ['A']),
      createMockNode('C', ['B']),
    ];

    const result = validateDag(nodes);
    expect(result.isValid).toBe(true);
    expect(result.hasCycle).toBe(false);
  });

  it('detects a direct cycle in DAG', () => {
    const nodes: TaskNode[] = [
      createMockNode('A', ['B']),
      createMockNode('B', ['A']),
    ];

    const result = validateDag(nodes);
    expect(result.isValid).toBe(false);
    expect(result.hasCycle).toBe(true);
    expect(result.errorMessage).toContain('Circular dependency detected');
  });

  it('detects missing orphan dependency', () => {
    const nodes: TaskNode[] = [
      createMockNode('A', ['NON_EXISTENT_NODE']),
    ];

    const result = validateDag(nodes);
    expect(result.isValid).toBe(false);
    expect(result.orphanDependencies?.length).toBe(1);
    expect(result.orphanDependencies?.[0].missingDepId).toBe('NON_EXISTENT_NODE');
  });

  it('identifies ready nodes whose dependencies are completed', () => {
    const nodes: TaskNode[] = [
      createMockNode('A', [], 'completed'),
      createMockNode('B', ['A'], 'pending'),
      createMockNode('C', ['B'], 'pending'),
    ];

    const ready = getReadyNodes(nodes);
    expect(ready.length).toBe(1);
    expect(ready[0].id).toBe('B');
  });

  it('correctly groups tasks into parallel execution layers', () => {
    // A and B can run in parallel (Layer 0)
    // C depends on A and B (Layer 1)
    // D depends on C (Layer 2)
    const nodes: TaskNode[] = [
      createMockNode('A', []),
      createMockNode('B', []),
      createMockNode('C', ['A', 'B']),
      createMockNode('D', ['C']),
    ];

    const layers = computeExecutionLayers(nodes);
    expect(layers.length).toBe(3);
    expect(layers[0].sort()).toEqual(['A', 'B'].sort());
    expect(layers[1]).toEqual(['C']);
    expect(layers[2]).toEqual(['D']);
  });
});
