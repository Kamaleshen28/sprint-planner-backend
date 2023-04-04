// find dependency graph and indegree of all nodes
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

// check for cyclic dependencies
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


// const rearrange stories based on preassigned developers
const rearrangeAvailableStories = (available,stories) => {
  const storiesWithPreassignedDevelopers = [];
  const storiesWithoutPreassignedDevelopers = [];
  for (let i = 0; i < available.length; i++) {
    if (
      stories[available[i]].assignedDeveloperId !== null &&
      stories[available[i]].assignedDeveloperId !== undefined
    ) {
      storiesWithPreassignedDevelopers.push(available[i]);
    } else {
      storiesWithoutPreassignedDevelopers.push(available[i]);
    }
  }
  for(let i=0;i<available.length;i++){
    if(i<storiesWithPreassignedDevelopers.length){
      available[i] = storiesWithPreassignedDevelopers[i];
    }else{
      available[i] = storiesWithoutPreassignedDevelopers[i-storiesWithPreassignedDevelopers.length];
    }
  }
};

// initialize pending, available and isComplete stories lists
const initialzeLists = (pending, available, isComplete, indegrees, stories) => {
  for (let i = 0; i < stories.length; i++) {
    if (indegrees[i] === 0) {
      available.push(i);
    } else {
      pending.push(i);
    }
    isComplete[i] = false;
  }
  pending.sort((a, b) => (a - b));
  available.sort((a, b) => (a - b));
  rearrangeAvailableStories(available,stories);
};

// update pending and available stories lists
const updateLists = (pending, available, indegrees, stories) => {
  let i = 0;
  while (i < pending.length) {
    if (indegrees[pending[i]] === 0) {
      available.push(pending[i]);
      pending.splice(i, 1);
    } else {
      i++;
    }
  }
  pending.sort((a, b) => (a - b));
  available.sort((a, b) => (a - b));
  rearrangeAvailableStories(available,stories);
};

// initialize the stories
const initializeStories = (stories) => {
  for (let i = 0; i < stories.length; i++) {
    stories[i].startDay = -1;
    stories[i].endDay = -1;
    stories[i].dummyDevs = [];
    stories[i].remainingDuration = stories[i].storyPoints;
  }
};

// create dummy developers
const createDummyDevlopers = (totalDevelopers) => {
  const dummyDevs = [];
  for (let i = 0; i < totalDevelopers; i++) {
    dummyDevs.push(i);
  }
  return dummyDevs;
};


// plan stories based on dependency graph
const planStories = (
  stories,
  developers,
  dependencyGraph,
  indegrees,
  developersOriginal,
  allowMultipleDevsOnStory = false
) => {
  if (checkCycleInDependencyGraph(dependencyGraph)) {
    throw new Error('Cycle detected in dependencies');
  }
  let currentDay = 0;
  let devsAvailable = developers.length;
  const pending = []; // stories with indegrees > 0
  const available = []; // stories with indegrees = 0
  const inProgress = [];
  const isComplete = [];

  initialzeLists(pending, available, isComplete, indegrees, stories);

  while (isComplete.some((x) => x === false)) {
    // console.log('Day :', currentDay);
    // console.log('developers :', developers);
    // console.log('inProgress :', inProgress);
    // console.log('available :', available);
    // console.log('pending :', pending);
    // console.log('isComplete :', isComplete);
    // console.log('devsAvailable :', devsAvailable);
    // console.log('-------------------------');
    // assign stories to developers
    while (available.length > 0 && devsAvailable > 0) {
      
      // console.log('assigning stories to developers')
      const storyID = available.splice(0, 1)[0];
      // const developer = developers.splice(0, 1)[0];
      let developer;
      if(stories[storyID].assignedDeveloperId!==null && stories[storyID].assignedDeveloperId!==undefined){
        const requiredDevIndex = developers.findIndex(dev=>dev===stories[storyID].assignedDeveloperId);
        if(requiredDevIndex!==-1){
          developer = developers.splice(requiredDevIndex, 1)[0];
          // console.log(`Developer ${developer} assigned to story ${storyID}`);
        }
        else{
          // if(developers.length!==0){

          //   console.log(`Developer ${stories[storyID].assignedDeveloperId} not found in developers list`);
          //   console.log('developers :', developers);
            
          // }
          // developer = developers.splice(0, 1)[0];
          // console.log(`Developer ${developer} assigned to story ${storyID} error case`);
          // console.log(developersOriginal)
          // console.log(stories[storyID].assignedDeveloperId)
          throw new Error(`Pre-assigned developer "${developersOriginal[stories[storyID].assignedDeveloperId].name}" cannot be assigned to story "${stories[storyID].title}"`);
        }
      }
      else{
        developer = developers.splice(0, 1)[0];
        // console.log(`Developer ${developer} assigned to story ${storyID}`);
      }
      stories[storyID].dummyDevs.push(developer);
      stories[storyID].startDay = currentDay;
      inProgress.push(storyID);
      inProgress.sort((a, b) => (a - b));
      devsAvailable--;
    }
    if (allowMultipleDevsOnStory) {
      // assign all devs to highest priority story
      if (devsAvailable > 0) {
        const storyID = Math.min(...inProgress);
        stories[storyID].dummyDevs.push(...developers);
        while (developers.length > 0) developers.pop();
        devsAvailable = 0;
      }
    }

    // update currentDay
    currentDay += 1;

    // update remainingDuration and isComplete list
    for (let i = 0; i < inProgress.length; i++) {
      stories[inProgress[i]].remainingDuration -=
        1 * stories[inProgress[i]].dummyDevs.length;

      if (stories[inProgress[i]].remainingDuration <= 0) {
        // console.log('story completed :', inProgress[i]);
        stories[inProgress[i]].endDay = currentDay;
        isComplete[inProgress[i]] = true;
        const freeDevs = stories[inProgress[i]].dummyDevs;
        developers.push(...freeDevs);
        devsAvailable += freeDevs.length;
        // update indegrees
        for (let j = 0; j < dependencyGraph[inProgress[i]].length; j++) {
          indegrees[dependencyGraph[inProgress[i]][j]]--;
        }
      }
    }
    // remove completed stories from inProgress
    let i = 0;
    while (inProgress.length > 0 && i < inProgress.length) {
      if (isComplete[inProgress[i]] === true) {
        inProgress.splice(i, 1);
      } else {
        i++;
      }
    }

    // update pending and available
    updateLists(pending, available, indegrees, stories);
  }
  return currentDay;
};

// map dummyDevs to real devs and remove dummyDevs
// const mapDevlopersToStoriesUtil = (stories, developers) => {
//   const dummyDevToRealDev = {};
//   const availableDevelopers = [];
//   const remainingDummyDevs = [];
//   for (let i = 0; i < developers.length; i++) {
//     availableDevelopers.push(developers[i].id);
//     remainingDummyDevs.push(i);
//   }

//   for (let i = 0; i < stories.length; i++) {
//     if (stories[i].assignedDeveloperId !== undefined && stories[i].assignedDeveloperId !== null) {
//       const availableDevIndex = availableDevelopers.indexOf(
//         stories[i].assignedDeveloperId
//       );
//       const remainingDevIndex = remainingDummyDevs.indexOf(
//         stories[i].dummyDevs[0]
//       );
//       // console.log(stories[i].assignedDeveloperId)
//       if(availableDevIndex !== -1 && remainingDevIndex !== -1) {
//         dummyDevToRealDev[stories[i].dummyDevs[0]] =
//           stories[i].assignedDeveloperId;
//         availableDevelopers.splice(
//           availableDevelopers.indexOf(stories[i].assignedDeveloperId),
//           1
//         );
//         remainingDummyDevs.splice(
//           remainingDummyDevs.indexOf(stories[i].dummyDevs[0]),
//           1
//         );
//       }
//       else{
//         // console.log('error');
//         if( stories[i].assignedDeveloperId !== dummyDevToRealDev[stories[i].dummyDevs[0]])
//           throw new Error(`Please change or remove the developer assigned to story "${stories[i].title}" as he is already assigned to another story`);
//       }

//     }
//   }

//   let i = 0;
//   while (i < stories.length && dummyDevToRealDev.length !== developers.length) {
//     if (
//       dummyDevToRealDev[stories[i].dummyDevs[0]] === undefined &&
//       !stories[i].assignedDeveloperId
//     ) {
//       dummyDevToRealDev[stories[i].dummyDevs[0]] = availableDevelopers[0];
//       availableDevelopers.splice(0, 1);
//       remainingDummyDevs.splice(
//         remainingDummyDevs.indexOf(stories[i].dummyDevs[0]),
//         1
//       );
//     }
//     i++;
//   }
//   for (let i = 0; i < remainingDummyDevs.length; i++) {
//     dummyDevToRealDev[remainingDummyDevs[i]] = availableDevelopers[i];
//   }
//   return dummyDevToRealDev;
// };

const mapDevlopersToStories = (stories, developers) => {

  // const dummyDevToRealDev = mapDevlopersToStoriesUtil(stories, developers);
  const dummyDevToRealDev = {};
  for (let i = 0; i < developers.length; i++) {
    dummyDevToRealDev[i] = developers[i].id;
  }

  for (let i = 0; i < stories.length; i++) {
    stories[i].developers = [];
    for (let j = 0; j < stories[i].dummyDevs.length; j++) {
      stories[i].developers.push(
        developers[dummyDevToRealDev[stories[i].dummyDevs[j]]]
      );

      stories[i].assignedDeveloperId = stories[i].developers[0].id;
    }
    delete stories[i].dummyDevs;
  }
};


// plan the sprints using stories startDay and endDay
const planSprints = (stories, numberOfSprints, sprintDuration, capacity) => {
  // const sprints = [];
  // for (let i = 0; i < numberOfSprints; i++) {
  //   sprints.push([]);
  // }
  // for (let i = 0; i < stories.length; i++) {
  //   const sprintNumberStart = Math.floor(
  //     stories[i].startDay / (sprintDuration * capacity)
  //   );
  //   const sprintNumberEnd = Math.floor(
  //     (stories[i].endDay - 1) / (sprintDuration * capacity)
  //   );
  //   sprints[sprintNumberStart].push(stories[i]);
  //   if (sprintNumberStart !== sprintNumberEnd) {
  //     sprints[sprintNumberEnd].push(stories[i]);
  //   }
  // }
  // // sort stories in each sprint by startDay
  // for (let i = 0; i < sprints.length; i++) {
  //   sprints[i].sort((a, b) => a.startDay - b.startDay);
  // }
  // return sprints;
  // console.log(numberOfSprints, sprintDuration, capacity);
  const sprints = [];
  for (let i = 0; i < numberOfSprints; i++) {
    sprints.push([]);
  }
  for (let i = 0; i < stories.length; i++) {
    const sprintNumberStart = Math.floor(stories[i].startDay / capacity);
    let sprintNumberEnd = Math.floor((stories[i].endDay - 1) / capacity);
    sprints[sprintNumberStart].push(stories[i]);
    // if (sprintNumberStart !== sprintNumberEnd) {
    //   sprints[sprintNumberEnd].push(stories[i]);
    // }
    
    while(sprintNumberStart !== sprintNumberEnd){
      sprints[sprintNumberEnd].push(stories[i]);
      sprintNumberEnd--;
    }

  }
  // sort stories in each sprint by startDay
  for (let i = 0; i < sprints.length; i++) {
    sprints[i].sort((a, b) => a.startDay - b.startDay);
  }
  return sprints;
};

const isPossible = (stories, totalDuration, sprintDuration, sprintCapacity) => {
  const maxEndDay = stories.reduce((acc, story) => {
    if (story.endDay > acc) return story.endDay;
    return acc;
  }, 0);
  // number of coding days in a sprint = sprintCapacity upto 1 decimal
  const allowedNumberOfSprints =
    Math.round((totalDuration / sprintDuration) * 10) / 10;
  // console.log('allowedNumberOfSprints', allowedNumberOfSprints);
  const totalNumberOfCodingDays = allowedNumberOfSprints * sprintCapacity;
  // console.log('totalNumberOfCodingDays', totalNumberOfCodingDays);
  // console.log(maxEndDay, totalNumberOfCodingDays);
  if (maxEndDay > totalNumberOfCodingDays) return false;
  return true;
};

const storyPlanning = (
  developers,
  stories,
  sprintDuration,
  sprintCapacity,
  givenTotalDuration = null
) => {
  if (developers.length === 0) throw new Error('No developers available');
  if (stories.length === 0) throw new Error('No stories available');
  const { dependencyGraph, indegrees } = getDependencyGraph(stories);
  initializeStories(stories);
  const dummyDevs = createDummyDevlopers(developers.length);
  const totalDuration = planStories(
    stories,
    dummyDevs,
    dependencyGraph,
    indegrees,
    developers
  );
  if (givenTotalDuration) {
    if (
      !isPossible(stories, givenTotalDuration, sprintDuration, sprintCapacity)
    ) {
      throw new Error(
        'Not possible to complete the project within the given time and the number of developers'
      );
    }
  }
  return {
    stories,
    dummyDevs,
    totalDuration,
  };
};

// main function
const getSprints = (
  stories,
  developers,
  sprintDuration,
  sprintCapacity,
  givenTotalDuration
) => {
  // console.log('stories', JSON.stringify(stories, null, 2));
  // console.log('developers', developers);
  // console.log('sprintDuration', sprintDuration);
  // console.log('capacity', capacity);

  // if (developers.length === 0) throw new Error('No developers available');
  // if (stories.length === 0) throw new Error('No stories available');
  // const { dependencyGraph, indegrees } = getDependencyGraph(stories);
  // initializeStories(stories);
  // const dummyDevs = createDummyDevlopers(developers.length);

  // const totalDuration = planStories(
  //   stories,
  //   dummyDevs,
  //   dependencyGraph,
  //   indegrees
  // );
  // if (givenTotalDuration) {
  //   if (!isPossible(stories, totalDuration, sprintDuration, capacity)) {
  //     throw new Error('Not possible to complete the project within the given time and the number of developers');
  //   }
  // }

  // !developers.length
  if (!developers && stories && givenTotalDuration) {
    // console.log('qwerty case');
    const maxDeveloperLimit = 50;
    for (
      let numberOfDevs = 1;
      numberOfDevs <= maxDeveloperLimit;
      numberOfDevs++
    ) {
      try {
        const dummyDevs = createDummyDevlopers(numberOfDevs);
        // create copy of stories: stories is an array of objects
        const storiesToPass = JSON.parse(JSON.stringify(stories));
        storyPlanning(
          dummyDevs,
          storiesToPass,
          sprintDuration,
          sprintCapacity,
          givenTotalDuration
        );
        return { numberOfDevs };
      } catch (error) {
        console.log(`Not possible with ${numberOfDevs} developers`);
      }
    }
    throw new Error('Not possible in the given time frame');
  }

  const {
    stories: plannedStories,
    dummyDevs,
    totalDuration,
  } = storyPlanning(
    JSON.parse(JSON.stringify(developers)),
    JSON.parse(JSON.stringify(stories)),
    sprintDuration,
    sprintCapacity,
    givenTotalDuration
  );

  const numberOfSprints = Math.ceil(totalDuration / sprintCapacity);
  mapDevlopersToStories(plannedStories, developers);

  const sprints = planSprints(
    plannedStories,
    numberOfSprints,
    sprintDuration,
    sprintCapacity
  ); // also return the developers array with the stories assigned to them
  // console.log('planned stories: ', plannedStories);
  // console.log('gfdghvmbn', sprints);
  return { sprints, plannedStories };
};

module.exports = { getSprints };
