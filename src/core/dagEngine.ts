import { TaskNode } from '../types/agent';

export interface DagValidationResult {
  isValid: boolean;
  hasCycle: boolean;
  cycleNodes?: string[];
  orphanDependencies?: { nodeId: string; missingDepId: string }[];
  errorMessage?: string;
}

/**
 * Validates a DAG of TaskNodes for cyclic dependencies and missing nodes.
 */
export function validateDag(nodes: TaskNode[]): DagValidationResult {
  const nodeMap = new Map<string, TaskNode>(nodes.map(n => [n.id, n]));
  const orphanDeps: { nodeId: string; missingDepId: string }[] = [];

  // 1. Check for missing dependency references
  for (const node of nodes) {
    for (const depId of node.dependencies) {
      if (!nodeMap.has(depId)) {
        orphanDeps.push({ nodeId: node.id, missingDepId: depId });
      }
    }
  }

  if (orphanDeps.length > 0) {
    return {
      isValid: false,
      hasCycle: false,
      orphanDependencies: orphanDeps,
      errorMessage: `Unresolved dependencies detected: ${orphanDeps.map(o => `${o.nodeId} -> ${o.missingDepId}`).join(', ')}`
    };
  }

  // 2. Cycle detection using Depth First Search (white/gray/black 3-color coloring)
  // 0: unvisited, 1: visiting (in current stack), 2: fully visited
  const visited = new Map<string, number>();
  const parentStack: string[] = [];
  let detectedCycle: string[] = [];

  function dfs(nodeId: string): boolean {
    visited.set(nodeId, 1);
    parentStack.push(nodeId);

    const node = nodeMap.get(nodeId);
    if (node) {
      for (const depId of node.dependencies) {
        const state = visited.get(depId) || 0;
        if (state === 1) {
          // Found cycle
          const cycleStartIdx = parentStack.indexOf(depId);
          detectedCycle = parentStack.slice(cycleStartIdx).concat(depId);
          return true;
        }
        if (state === 0) {
          if (dfs(depId)) return true;
        }
      }
    }

    visited.set(nodeId, 2);
    parentStack.pop();
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id) || visited.get(node.id) === 0) {
      if (dfs(node.id)) {
        return {
          isValid: false,
          hasCycle: true,
          cycleNodes: detectedCycle,
          errorMessage: `Circular dependency detected: ${detectedCycle.join(' -> ')}`
        };
      }
    }
  }

  return {
    isValid: true,
    hasCycle: false
  };
}

/**
 * Returns all nodes that are currently pending and have all their dependencies completed.
 */
export function getReadyNodes(nodes: TaskNode[]): TaskNode[] {
  const nodeMap = new Map<string, TaskNode>(nodes.map(n => [n.id, n]));
  
  return nodes.filter(node => {
    if (node.status !== 'pending' && node.status !== 'ready') {
      return false;
    }

    // Check if every dependency is completed
    const allDepsSatisfied = node.dependencies.every(depId => {
      const depNode = nodeMap.get(depId);
      return depNode && depNode.status === 'completed';
    });

    return allDepsSatisfied;
  });
}

/**
 * Generates topological layer groupings for parallel execution visualization.
 */
export function computeExecutionLayers(nodes: TaskNode[]): string[][] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, node.dependencies.length);
    for (const depId of node.dependencies) {
      if (!adjacency.has(depId)) {
        adjacency.set(depId, []);
      }
      adjacency.get(depId)!.push(node.id);
    }
  }

  const layers: string[][] = [];
  let currentLayer = nodes.filter(n => (inDegree.get(n.id) || 0) === 0).map(n => n.id);

  const processed = new Set<string>();

  while (currentLayer.length > 0) {
    layers.push(currentLayer);
    currentLayer.forEach(id => processed.add(id));

    const nextLayer: string[] = [];
    for (const id of currentLayer) {
      const neighbors = adjacency.get(id) || [];
      for (const neighborId of neighbors) {
        const remaining = (inDegree.get(neighborId) || 1) - 1;
        inDegree.set(neighborId, remaining);
        if (remaining === 0 && !processed.has(neighborId)) {
          nextLayer.push(neighborId);
        }
      }
    }

    currentLayer = nextLayer;
  }

  return layers;
}
