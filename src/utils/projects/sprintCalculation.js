const { getSprints } = require('../sprintPlanner');

const calculateSprint = (project) => {
  console.log('Calculating sprint');
  // data preparation
  // console.log(project);
  const {
    stories,
    developers,
    sprintDuration,
    sprintCapacity,
    givenTotalDuration,
  } = project;
  /*
  let storyMap;
  let developerMap;
  [stories, storyMap] = mapStoriesToNumberIds(stories);
  [developers, developerMap] = mapDevelopersToNumberIds(developers);
  */
  const updatedStories = stories.map((story) => {
    const { preAssignedDeveloperId } = story;
    const x = {
      ...story,
    };
    delete x.preAssignedDeveloperId;
    return {
      ...x,
      assignedDeveloperId: preAssignedDeveloperId,
    };
  });
  // const { sprints, plannedStories } = getSprints(
  const res = getSprints(
    updatedStories, // stories,
    developers,
    sprintDuration,
    sprintCapacity,
    givenTotalDuration
  );

  // console.log(`Sprints`, sprints);
  if (res.numberOfDevs) {
    return {
      ...project,
      minimumNumberOfDevelopers: res.numberOfDevs,
    };
  }
  return {
    ...project,
    sprints: res.sprints,
    plannedStories: res.plannedStories,
  };
};

module.exports = calculateSprint;
