const csvConversion = (data) => {
  const { plannedStories, developers } = data;
  const dataToConvert = plannedStories.map((story, ind) => ({
    index: ind + 1,
    title: story.title,
    description: story.description,
    developer: developers[story.assignedDeveloperId].name,
  }));
  let csvString = 'index,title,description,developer,\n';
  dataToConvert.forEach((row) => {
    csvString += `${row.index},${row.title},${row.description},${row.developer},\n`;
  });
  return csvString;
};

module.exports = csvConversion;
