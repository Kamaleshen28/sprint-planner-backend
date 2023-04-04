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
    attributes: [
      'id',
      'title',
      'owner',
      'status',
      'remarks',
      'projectStartDate',
      'isBookmarked',
    ],
  });
  return projects;
};

const createProject = async (owner, project) => {
  const { stories, developers, ...newProject } = project;
  const savedProject = await Project.create({ ...newProject, owner });

  // ------------------ Can be shifted to funtion in respective models ------------------
  const storiesWithProjectId = stories.map((story) => ({
    ...story,
    projectId: savedProject.id,
  }));
  await Story.bulkCreate(storiesWithProjectId);

  if (developers) {
    const developersWithProjectId = developers.map((developer) => ({
      ...developer,
      projectId: savedProject.id,
    }));
    await Developer.bulkCreate(developersWithProjectId);
  }
  // if (!developers) return project; // don't create project if no developers are provided: caller just needs an advice on how many developers are needed
  // --------------------------------------------------------------------------------

  // required? as the developes array will be empty if !developers
  if (developers) {
    const result = await Project.findByPk(savedProject.id, {
      include: ['stories', 'developers'],
    });
    console.log('result', result);
    return result;
  }
  const result = await Project.findByPk(savedProject.id, {
    include: ['stories'],
  });
  console.log('result', result);
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
  console.log('bulk delete on stories done');
  console.log('storiesWithProjectId', storiesWithProjectId);
  const temp = await Story.bulkCreate(storiesWithProjectId);
  console.log('temp', temp);
  console.log('bulk update on stories done');
};

// edit developer table
const updateDeveloperDetails = async (projectId, developers) => {
  console.log('developers', developers);
  if (developers) {
    const developersWithProjectId = developers.map((developer) => ({
      ...developer,
      projectId,
    }));
    await Developer.destroy({
      where: { projectId },
    });
    await Developer.bulkCreate(developersWithProjectId);
    console.log('bulk update on developers done');
  } else {
    await Developer.destroy({
      where: { projectId },
    });
    console.log('bulk delete on developers done');
  }
};

const editProject = async (owner, projectId, projectData) => {
  const { stories, developers, ...editedProjectData } = projectData;
  // if (!developers) {
  //   return projectData;
  // }
  console.log('updating project details');
  const updateResult = await updateProjectDetails(
    projectId,
    owner,
    editedProjectData
  );
  if (!stories && !developers) {
    return updateResult[0];
  }
  console.log('updating story details');
  await updateStoryDetails(projectId, stories);
  console.log('updating developer details');
  // if (developers) {
  await updateDeveloperDetails(projectId, developers);
  // }

  if (developers) {
    const result = await Project.findByPk(projectId, {
      include: ['stories', 'developers'],
    });
    // console.log('result', result);
    return result;
  }

  // eslint-disable-next-line consistent-return
  const result = await Project.findByPk(projectId, {
    include: ['stories'],
  });
  return result;
};

// update project status
const updateProjectStatus = async (projectId, status) => {
  await Project.update({ status }, { where: { id: projectId } });
};

// update project remarks
const updateProjectRemarks = async (projectId, remarks) => {
  await Project.update({ remarks }, { where: { id: projectId } });
};

module.exports = {
  getProject,
  getProjectListByOwner,
  createProject,
  deleteProject,
  editProject,
  updateProjectStatus,
  updateProjectRemarks,
  updateProjectDetails,
  updateStoryDetails,
  updateDeveloperDetails,
};
