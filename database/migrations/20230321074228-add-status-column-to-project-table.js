/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // aad column: status (enum: [planned, unsupportedInput]) to project table
    await queryInterface.addColumn('project', 'status', {
      type: Sequelize.ENUM('planned', 'unsupportedInput'),
      allowNull: false,
      defaultValue: 'planned',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project', 'status');
  },
};
