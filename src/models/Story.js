const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    static associate(models) {
      Story.belongsTo(models.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
        as: 'project',
      });
      //   Story.belongsTo(models.Developer, { foreignKey: 'developerId' });
    }
  }
  Story.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storyPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //   developerId: {
      //     type: DataTypes.INTEGER,
      //     allowNull: true,
      //   },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Story',
      tableName: 'developer',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Story;
};
