/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add owner column to project table
    await queryInterface.addColumn('project', 'owner', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'admin', // for the projects created earlier
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('project', 'owner');
  },
};
