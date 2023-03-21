const { Project, Story, Developer } = require('../models');

/*
static associate(models) {
      Project.hasMany(models.Story, { foreignKey: 'projectId', as: 'stories' });
      Project.belongsToMany(models.Developer, {
        through: 'project_developer_junction',
        foreignKey: 'projectId',
        as: 'developers',
      });
*/
const getProject = async (owner, id) => {
  const project = await Project.findOne({
    where: { id, owner },
    include: ['stories', 'developers'],
  });
  return project;
};

const getProjectListByOwner = async (owner) => {
  const projects = await Project.findAll({
    where: { owner }, // select only id, title and owner
    attributes: ['id', 'title', 'owner'],
  });
  return projects;
};

const createProject = async (owner, project) => {
  const { stories, developers, ...newProject } = project;
  if (!developers) return project; // don't create project if no developers are provided: caller just needs an advice on how many developers are needed
  const savedProject = await Project.create({ ...newProject, owner });

  // ------------------ Can be shifted to funtion in respective models ------------------
  const storiesWithProjectId = stories.map((story) => ({
    ...story,
    projectId: savedProject.id,
  }));
  await Story.bulkCreate(storiesWithProjectId);

  const developersWithProjectId = developers.map((developer) => ({
    ...developer,
    projectId: savedProject.id,
  }));
  await Developer.bulkCreate(developersWithProjectId);
  // --------------------------------------------------------------------------------

  const result = await Project.findByPk(savedProject.id, {
    include: ['stories', 'developers'],
  });
  return result;
};

const deleteProject = async (owner, id) => {
  const result = await Project.destroy({ where: { id, owner } });
  return result;
};

// edit project table
const updateProjectDetails = async (projectId, owner, editedProjectData) =>
  Project.update(
    { ...editedProjectData, owner },
    {
      where: { id: projectId, owner },
    }
  );

// edit story table
const updateStoryDetails = async (projectId, stories) => {
  const storiesWithProjectId = stories.map((story) => ({
    ...story,
    projectId,
  }));
  await Story.destroy({
    where: { projectId },
  });
  await Story.bulkCreate(storiesWithProjectId);
};

// edit developer table
const updateDeveloperDetails = async (projectId, developers) => {
  const developersWithProjectId = developers.map((developer) => ({
    ...developer,
    projectId,
  }));
  await Developer.destroy({
    where: { projectId },
  });
  await Developer.bulkCreate(developersWithProjectId);
};

const editProject = async (owner, projectId, projectData) => {
  const { stories, developers, ...editedProjectData } = projectData;
  if (!developers) {
    return;
  }
  await updateProjectDetails(projectId, owner, editedProjectData);
  await updateStoryDetails(projectId, stories);
  await updateDeveloperDetails(projectId, developers);

  const result = await Project.findByPk(projectId, {
    include: ['stories', 'developers'],
  });
  // eslint-disable-next-line consistent-return
  return result;
};

// update project status
const updateProjectStatus = async (projectId, status) => {
  await Project.update({ status }, { where: { id: projectId } });
};

module.exports = {
  getProject,
  getProjectListByOwner,
  createProject,
  deleteProject,
  editProject,
  updateProjectStatus,
};
