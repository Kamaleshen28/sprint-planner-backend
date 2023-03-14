/* eslint-disable no-param-reassign */
const PriorityQueue = require('./priorityQueue');

const initialzeLists = (indegrees, stories) => {
  const pending = []; // stories with indegrees > 0
  const available = PriorityQueue(); // stories with indegrees = 0
  const inProgress = PriorityQueue();
  const isComplete = [];

  for (let i = 0; i < stories.length; i++) {
    if (indegrees[i] === 0) {
      available.enqueue(i, -i); // -i to make it a min heap
    } else {
      pending.push(i);
    }
    isComplete[i] = false;
  }
  pending.sort();

  return { pending, availableStories: available, inProgress, isComplete };
};

const assignDevelopersOneByOne = (
  stories,
  availableStories,
  developersAvailable,
  inProgress,
  currentDay
) => {
  // sort developersAvailable by capacity
  developersAvailable.sort((a, b) => a.capacity - b.capacity);
  const unHandledStories = [];

  // assign available stories to developers available one by one: uses linear search to find the nearest developer with capacity >= story effort
  while (!availableStories.isEmpty()) {
    const storyID = availableStories.dequeue();
    let assigned = false;
    for (let i = 0; i < developersAvailable.length; i++) {
      if (developersAvailable[i].capacity >= stories[storyID].storyPoints) {
        developersAvailable[i].capacity -= stories[storyID].storyPoints;
        stories[storyID].developers.push(developersAvailable[i]);
        assigned = true;
        inProgress.enqueue(
          storyID,
          -(stories[storyID].storyPoints + currentDay)
        );
        stories[storyID].startDay = currentDay;
        stories[storyID].endDay = currentDay + stories[storyID].duration;
        stories[storyID].developers.push(developersAvailable[i].id);
        developersAvailable.splice(i, 1);
        break;
      }
    }
    if (!assigned) {
      unHandledStories.push(storyID);
    }
  }
  // put unhandled stories back into availableStories
  for (let i = 0; i < unHandledStories.length; i++) {
    availableStories.enqueue(unHandledStories[i], -unHandledStories[i]);
  }
};

const assignDevelopersToHighestPriorityStory = (
  stories,
  availableStories,
  developersAvailable,
  inProgress,
  currentDay
) => {
  const unHandledStories = [];
  while (!availableStories.isEmpty()) {
    const storyID = availableStories.dequeue();
    let assigned = false;
    // let totalCapacity = 0;
    // for (let i = 0; i < developersAvailable.length; i++) {
    //   totalCapacity += developersAvailable[i].capacity;
    // }
    const totalCapacity = developersAvailable.reduce(
      (acc, dev) => acc + dev.capacity,
      0
    );
    if (totalCapacity < stories[storyID].storyPoints) {
      unHandledStories.push(storyID);
      // eslint-disable-next-line no-continue
      continue;
    } else {
      let remainingEffort = stories[storyID].storyPoints;
      const i = 0;
      while (remainingEffort >= 0) {
        if (developersAvailable[i].capacity >= remainingEffort) {
          developersAvailable[i].capacity -= remainingEffort;
          stories[storyID].developers.push(developersAvailable[i]);
          assigned = true;
          inProgress.enqueue(
            storyID,
            -(stories[storyID].storyPoints + currentDay)
          );
          stories[storyID].startDay = currentDay;
          stories[storyID].endDay = currentDay + stories[storyID].duration;
          stories[storyID].developers.push(developersAvailable[i].id);
          developersAvailable.splice(i, 1);
          break;
        } else {
          remainingEffort -= developersAvailable[i].capacity;
          stories[storyID].developers.push(developersAvailable[i]);
          developersAvailable.splice(i, 1);
        }
      }
      if (!assigned) {
        unHandledStories.push(storyID);
      }
    }
  }
  // put unhandled stories back into availableStories
  for (let i = 0; i < unHandledStories.length; i++) {
    availableStories.enqueue(unHandledStories[i], -unHandledStories[i]);
  }
};

const planStories = (
  stories,
  developers,
  dependencyGraph,
  indegrees,
  allowMultipleDevsOnStory = false
) => {
  let currentDay = 0;
  const developersAvailable = [...developers];
  const { pending, availableStories, inProgress, isComplete } = initialzeLists(
    indegrees,
    stories
  );

  // simulation loop
  while (
    pending.length ||
    !availableStories.isEmpty() ||
    !inProgress.isEmpty()
  ) {
    // all the stories in inProgress whose endDay is currentDay are now complete and can be removed from inProgress
    // the developers assigned to these stories are now available
    let atleastOneStoryCompleted = false;
    while (!inProgress.isEmpty() && inProgress.peek().endDay === currentDay) {
      atleastOneStoryCompleted = true;
      const story = inProgress.dequeue();
      developersAvailable.push(...story.developers);
      isComplete[story.id] = true;
      // update indegrees
      for (let i = 0; i < dependencyGraph[story.id].length; i++) {
        indegrees[dependencyGraph[story.id][i]]--;
        // if the indegree of a story is 0, it is now available
        if (indegrees[dependencyGraph[story.id][i]] === 0) {
          availableStories.enqueue(
            dependencyGraph[story.id][i],
            -dependencyGraph[story.id][i]
          );
        }
      }
    }

    // assign available stories to developers available one by one: uses binary search to find the nearest developer with capacity >= story.remainingDuration
    assignDevelopersOneByOne(
      stories,
      availableStories,
      developersAvailable,
      inProgress,
      currentDay
    );

    if (allowMultipleDevsOnStory) {
      // if there are still available stories and developers available, assign all developers to the highest priority story in availableStories if their combined capacity is >= story.remainingDuration, otherwise iterate through availableStories to find a story whose remaining duration can be met by some or all developers available
      assignDevelopersToHighestPriorityStory(
        stories,
        availableStories,
        developersAvailable,
        inProgress,
        currentDay
      );
    }

    if (atleastOneStoryCompleted) {
      currentDay = inProgress.peek().endDay;
    } else {
      break;
    }
  }
};
