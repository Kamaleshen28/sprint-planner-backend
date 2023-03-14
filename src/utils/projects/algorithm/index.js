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
  const initializedDevelopers = developers.map((developer) => ({
    ...developer,
    tasksWaiting: PriorityQueue(),
  }));
  // if stories already have a preassigned developer, those developers' capacity should be reduced by the story points of the story
  // also while doing this, if the developer's capacity becomes less than 0, throw an error saying that the developer is overbooked

  // plan stories

  // planned stories contain start day and end day, also the developers assigned to the story
  // now we need to break the story into sprints
  // Assumption: each projectc will start on Monday
  // Every Monday will be free for the developers to plan the next sprint
  // Every sprint will have a duration of 2 weeks
  // Every saturday and sunday will be free for the developers
};
