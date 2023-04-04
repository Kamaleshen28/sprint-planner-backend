const projectUtils = require('../../src/utils/projects/csvConversion');

describe('returnStartAndEndDates', () => {
  it('should return start and end dates', () => {
    const projectStartDate = '2020-08-01';
    const startDay = 2;
    const endDay = 5;
    const result = projectUtils.returnStartAndEndDates(
      projectStartDate,
      startDay,
      endDay
    );
    expect(result).toEqual({
      startDate: 'Tue Aug 04 2020',
      endDate: 'Thu Aug 06 2020',
    });
  });
});

describe('csvConversion', () => {
  it('should return csv string', () => {
    const data = {
      plannedStories: [
        {
          title: 'story 1',
          startDay: 2,
          endDay: 5,
          assignedDeveloperId: 1,
        },
        {
          title: 'story 2',
          startDay: 3,
          endDay: 6,
          assignedDeveloperId: 2,
        },
      ],
      developers: {
        1: {
          name: 'developer 1',
        },
        2: {
          name: 'developer 2',
        },
      },
      projectStartDate: '2020-08-01',
    };
    const result = projectUtils.csvConversion(data);
    expect(result).toEqual(
      'index,start,end,title,developer,\n1,Tue Aug 04 2020,Thu Aug 06 2020,story 1,developer 1,\n2,Wed Aug 05 2020,Fri Aug 07 2020,story 2,developer 2,\n'
    );
  });
});
