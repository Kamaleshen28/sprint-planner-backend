/* eslint-disable no-param-reassign */
const checkCycleInDependencyGraphUtil = (
  v,
  dependencyGraph,
  visited,
  stack
) => {
  if (stack[v]) {
    return true;
  }
  if (visited[v]) {
    return false;
  }
  visited[v] = true;
  stack[v] = true;
  for (let i = 0; i < dependencyGraph[v].length; i++) {
    if (
      checkCycleInDependencyGraphUtil(
        dependencyGraph[v][i],
        dependencyGraph,
        visited,
        stack
      )
    ) {
      return true;
    }
  }
  stack[v] = false;
  return false;
};

const checkCycleInDependencyGraph = (dependencyGraph) => {
  const visited = {};
  const stack = {};
  for (let i = 0; i < dependencyGraph.length; i++) {
    visited[i] = false;
    stack[i] = false;
  }
  for (let i = 0; i < dependencyGraph.length; i++) {
    if (checkCycleInDependencyGraphUtil(i, dependencyGraph, visited, stack)) {
      return true;
    }
  }
  return false;
};

module.exports = checkCycleInDependencyGraph;
