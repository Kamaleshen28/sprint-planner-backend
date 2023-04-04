const { csvConversion } = require('./csvConversion');

module.exports = {
  calculateSprint: require('./sprintCalculation'),
  convertToCSV: csvConversion,
};
