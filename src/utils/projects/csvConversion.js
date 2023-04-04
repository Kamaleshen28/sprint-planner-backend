const returnStartAndEndDates = (projectStartDate, startDay, endDay) => {
  let startDate = new Date(projectStartDate);
  let count = 0;
  while (
    count < startDay ||
    startDate.getDay() === 0 ||
    startDate.getDay() === 6
  ) {
    startDate = new Date(startDate.setDate(startDate.getDate() + 1));
    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
      // Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
      count++;
    }
  }

  const duration = endDay - startDay - 1;
  let endDate = new Date(startDate);

  count = 0;
  while (count < duration) {
    endDate = new Date(endDate.setDate(endDate.getDate() + 1));
    if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
      // Date.getDay() gives weekday starting from 0(Sunday) to 6(Saturday)
      count++;
    }
  }
  return {
    startDate: startDate.toDateString(),
    endDate: endDate.toDateString(),
  };
};

const csvConversion = (data) => {
  const { plannedStories, developers, projectStartDate } = data;
  const dataToConvert = plannedStories.map((story, ind) => ({
    index: ind + 1,
    ...returnStartAndEndDates(projectStartDate, story.startDay, story.endDay),
    title: story.title,
    // description: story.description,
    developer: developers[story.assignedDeveloperId].name,
  }));
  let csvString = 'index,start,end,title,developer,\n';
  dataToConvert.forEach((row) => {
    csvString += `${row.index},${row.startDate},${row.endDate},${row.title},${row.developer},\n`;
  });
  return csvString;
};

module.exports = { csvConversion, returnStartAndEndDates };
