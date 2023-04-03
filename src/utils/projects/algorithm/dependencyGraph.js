const getDependencyGraph = (stories) => {
  const dependencyGraph = [];
  const indegrees = {};
  for (let i = 0; i < stories.length; i++) {
    dependencyGraph.push([]);
    indegrees[i] = stories[i].dependencies.length;
  }
  // console.log(`dependencyGraph`, dependencyGraph);
  for (let i = 0; i < stories.length; i++) {
    // console.log(`i`, i);
    // console.log(`stories[i].dependencies`, stories[i].dependencies);
    for (let j = 0; j < stories[i].dependencies.length; j++) {
      dependencyGraph[stories[i].dependencies[j]].push(i);
    }
  }
  return { dependencyGraph, indegrees };
};

module.exports = getDependencyGraph;
