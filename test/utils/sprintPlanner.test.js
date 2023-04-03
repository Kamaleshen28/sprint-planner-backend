const { getSprints } = require('../../src/utils/sprintPlanner');
const inputs = require('./inputs');
const output = require('./output.json');

describe('getSprints', () => {
  // 1
  it('should return sprints ( base case)', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input1;
    const outputExpected = output.output1;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 2
  it('should return sprints ( multiple storie ending at same time )', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input2;
    const outputExpected = output.output2;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 3
  it('should return sprints ( story ending at same time sprint is ending )', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input3;
    const outputExpected = output.output3;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 4
  it('should return sprints ( base case 2)', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input4;
    const outputExpected = output.output4;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 5
  it('should throw error in case of circular dependency', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input5;
    const outputExpected = output.output5;
    expect(() =>
      getSprints(stories, developers, sprintDuration, capacity)
    ).toThrow(outputExpected);
  });
  // 6
  it('should return sprints when a developer is pre-assigned to a story', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input6;
    const outputExpected = output.output6;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 7
  it('should return sprints ( more independent stories )', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input7;
    const outputExpected = output.output7;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 8
  it('should return sprints ( more complex dependencies )', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input8;
    const outputExpected = output.output8;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 9
  it('should return sprints when more than one stories become available simultaneously', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input9;
    const outputExpected = output.output9;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 10
  it('should return sprints when more than two stories become available simultaneously', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input10;
    const outputExpected = output.output10;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 11;
  it('should return sprints when more than two stories become available simultaneously', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input11;
    const outputExpected = output.output11;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 12
  it('should return sprints when more than two stories become available simultaneously and developers=2', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input12;
    const outputExpected = output.output12;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 13
  it('should return sprints developers=1', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input13;
    const outputExpected = output.output13;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 14
  it('should return sprints when many developers available', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input14;
    const outputExpected = output.output14;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  //  15
  it('should return sprints for another dependency graph when developrs=3', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input15;
    const outputExpected = output.output15;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  //  16
  it('should return sprints developers=2', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input16;
    const outputExpected = output.output16;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  //  17
  it('should return sprints when developers are more than user stories', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input17;
    const outputExpected = output.output17;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 18
  it('should throw error when no stories is given', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input18;
    const outputExpected = output.output18;
    expect(() =>
      getSprints(stories, developers, sprintDuration, capacity)
    ).toThrow(outputExpected);
  });
  // 19
  it('should suggest minimum number of developers required when no developers are given', () => {
    const {
      stories,
      developers,
      sprintDuration,
      givenTotalDuration,
      sprintCapacity,
    } = inputs.input19;
    expect(
      getSprints(
        stories,
        developers,
        sprintDuration,
        sprintCapacity,
        givenTotalDuration
      )
    ).toEqual({ numberOfDevs: 1 });
  });
  // 20
  it('should return sprints when sprint duration is 3 weeks', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input20;
    const outputExpected = output.output20;
    expect(getSprints(stories, developers, sprintDuration, capacity)).toEqual(
      outputExpected
    );
  });
  // 21
  it('should return error that given assigned developer cannot be assigned to give story when developer is not available', () => {
    const { stories, developers, sprintDuration, capacity } = inputs.input21;
    const outputExpected = new Error(
      'Pre-assigned developer "smita" cannot be assigned to story "story 1"'
    );
    expect(() =>
      getSprints(stories, developers, sprintDuration, capacity)
    ).toThrow(outputExpected);
  });
});
