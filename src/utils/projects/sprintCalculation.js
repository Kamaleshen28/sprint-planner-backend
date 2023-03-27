const { getSprints } = require('../sprintPlanner');

const calculateSprint = (project) => {
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
  const { sprints, plannedStories } = getSprints(
    updatedStories, // stories,
    developers,
    sprintDuration,
    sprintCapacity,
    givenTotalDuration
  );

  // console.log(`Sprints`, sprints);
  if (sprints.numberOfDevs) {
    return {
      ...project,
      minimumNumberOfDevelopers: sprints.numberOfDevs,
    };
  }

  return { ...project, sprints, plannedStories };
};

module.exports = calculateSprint;
