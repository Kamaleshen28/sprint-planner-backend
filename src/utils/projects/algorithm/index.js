const getDependencyGraph = require('./dependencyGraph');
const PriorityQueue = require('./priorityQueue');
const checkCycleInDependencyGraph = require('./cyclicDependency');

const initializeStories = (stories) => {
  const storiesCopy = [...stories];
  for (let i = 0; i < stories.length; i++) {
    storiesCopy[i].startDay = -1;
    storiesCopy[i].endDay = -1;
    storiesCopy[i].developers = [];
    storiesCopy[i].remainingDuration = stories[i].storyPoints;
  }
  return storiesCopy;
};

const getSprints = (stories, developers, sprintDuration, capacity) => {
  if (developers.length === 0) throw new Error('No developers available');

  if (stories.length === 0) throw new Error('No stories available');

  const { dependencyGraph, indegrees } = getDependencyGraph(stories);

  if (checkCycleInDependencyGraph(dependencyGraph))
    throw new Error('Cyclic dependency exists');

  const initializedStories = initializeStories(stories);
};
