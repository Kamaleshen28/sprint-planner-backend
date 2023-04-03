const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Story, { foreignKey: 'projectId', as: 'stories' });
      Project.hasMany(models.Developer, {
        foreignKey: 'projectId',
        as: 'developers',
      });
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      sprintDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2, // 2 weeks (= 10 working days)
      },
      sprintCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      givenTotalDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin', // for the projects created earlier
      },
      status: {
        type: DataTypes.ENUM('planned', 'unsupportedInput'),
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      isBookmarked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Project',
      tableName: 'project',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // set default sort order: order by projectStartDate: ASC
      defaultScope: {
        order: [['projectStartDate', 'ASC']],
      },
    }
  );
  return Project;
};
