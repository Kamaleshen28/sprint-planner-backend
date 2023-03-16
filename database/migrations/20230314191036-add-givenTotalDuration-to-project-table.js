/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add column givenTotalDuration to project table
    await queryInterface.addColumn('project', 'givenTotalDuration', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project', 'givenTotalDuration');
  },
};
