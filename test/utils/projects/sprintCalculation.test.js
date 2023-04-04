const { getSprints } = require('../../../src/utils/sprintPlanner');
const calculateSprint = require('../../../src/utils/projects/sprintCalculation');

jest.mock('../../../src/utils/sprintPlanner');

describe('calculateSprint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return minimum number of developers required when developers are not provided', () => {
    const project = {
      stories: [
        {
          id: 0,
          name: 'story1',
          dependencies: [],
          storyPoints: 2,
        },
      ],

      sprintDuration: 2,
      capacity: 10,
      givenTotalDuration: 4,
    };
    const outputExpected = {
      numberOfDevs: 1,
    };
    getSprints.mockReturnValue(outputExpected);
    const output = {
      ...project,
      minimumNumberOfDevelopers: 1,
    };
    expect(calculateSprint(project)).toEqual(output);
  });
  it('should return sprints when developers are provided', () => {
    const project = {
      stories: [
        {
          id: 0,
          name: 'story1',
          dependencies: [],
          storyPoints: 2,
        },
      ],
      developers: [
        {
          id: 0,
          name: 'dev1',
          capacity: 10,
        },
      ],
      sprintDuration: 2,
      capacity: 10,
      givenTotalDuration: 4,
    };
    const outputExpected = {
      sprints: [
        {
          id: 0,
          stories: [
            {
              id: 0,
              name: 'story1',
              dependencies: [],
              storyPoints: 2,
            },
          ],
          developers: [
            {
              id: 0,
              name: 'dev1',
              capacity: 10,
            },
          ],
          duration: 2,
          capacity: 10,
        },
      ],
      plannedStories: [
        {
          id: 0,
          name: 'story1',
          dependencies: [],
          storyPoints: 2,
        },
      ],
    };
    getSprints.mockReturnValue(outputExpected);
    const output = {
      ...project,
      ...outputExpected,
    };
    expect(calculateSprint(project)).toEqual(output);
  });
});
