/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column projectStartDate to table projects
    await queryInterface.addColumn('project', 'projectStartDate', {
      type: Sequelize.DATE,
      defaultValue: () => Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project', 'projectStartDate');
  },
};
