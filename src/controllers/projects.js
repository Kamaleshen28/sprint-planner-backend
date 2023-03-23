const { PROJECT_SERVICES } = require('../services');
const PROJECT_UTILS = require('../utils/projects');

// get project by id
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PROJECT_SERVICES.getProject(req.user.username, id);
    if (result.status === 'unsupportedInput') {
      return res.status(200).json({
        message: 'Project Draft',
        data: result,
      });
    }
    if (result.status === 'planned') {
      console.log('Project planned');
      // do sprint calculation on this data
      const sprintCalculation = PROJECT_UTILS.calculateSprint(
        JSON.parse(JSON.stringify(result))
      );
      return res.status(200).json({
        message: 'Project created successfully',
        data: sprintCalculation,
      });
      // return res.status(200).json({
      //   message: 'Project fetched successfully',
      //   data: result,
      // });
    }
    return res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getProjectList = async (req, res) => {
  try {
    const result = await PROJECT_SERVICES.getProjectListByOwner(
      req.user.username
    );
    if (!result || !result.length) {
      return res.status(404).json({ message: 'No project found' });
    }
    return res.status(200).json({
      message: 'Project list fetched successfully',
      data: result,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  let projectId = null;
  try {
    // data format to be validated
    const {
      title,
      sprintDuration,
      sprintCapacity,
      stories,
      developers,
      projectStartDate,
      givenTotalDuration,
    } = req.body;
    const result = await PROJECT_SERVICES.createProject(req.user.username, {
      title,
      sprintDuration,
      sprintCapacity,
      stories,
      developers,
      projectStartDate,
      givenTotalDuration,
    });
    if (result && result.id) {
      console.log('Project created successfully, saving id');
      projectId = result.id;
    }
    // do sprint calculation on this data
    const sprintCalculation = PROJECT_UTILS.calculateSprint(
      JSON.parse(JSON.stringify(result))
    );
    console.log('Sprint calculation done');
    console.log(sprintCalculation);

    const { minimumNumberOfDevelopers } = sprintCalculation;
    if (!minimumNumberOfDevelopers) {
      await PROJECT_SERVICES.updateProjectStatus(projectId, 'planned');
      await PROJECT_SERVICES.updateProjectRemarks(projectId, '');
      sprintCalculation.status = 'planned';
      sprintCalculation.remarks = '';
    } else {
      await PROJECT_SERVICES.updateProjectStatus(projectId, 'unsupportedInput');
      await PROJECT_SERVICES.updateProjectRemarks(
        projectId,
        `DEVELOPERS REQUIRED ${minimumNumberOfDevelopers}`
      );
      sprintCalculation.status = 'unsupportedInput';
      sprintCalculation.remarks = `DEVELOPERS REQUIRED ${minimumNumberOfDevelopers}`;
    }

    return res.status(201).json({
      message: 'Project created successfully',
      data: sprintCalculation,
    });
  } catch (error) {
    const resBody = { message: error.message };
    if (projectId) {
      resBody.projectId = projectId;
      await PROJECT_SERVICES.updateProjectStatus(projectId, 'unsupportedInput');
      await PROJECT_SERVICES.updateProjectRemarks(projectId, error.message);
      console.log('updated project status and remarks');
    }
    return res.status(500).json(resBody);
  }
};

const editProjectDetailsById = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      title,
      sprintDuration,
      sprintCapacity,
      stories,
      developers,
      projectStartDate,
      givenTotalDuration,
    } = req.body;
    const result = await PROJECT_SERVICES.editProject(req.user.username, id, {
      title,
      sprintDuration,
      sprintCapacity,
      stories,
      developers,
      projectStartDate,
      givenTotalDuration,
    });

    const sprintPlan = PROJECT_UTILS.calculateSprint(
      JSON.parse(JSON.stringify(result))
    );
    const { minimumNumberOfDevelopers } = sprintPlan;
    console.log('minimumNumberOfDevelopers', minimumNumberOfDevelopers);
    if (minimumNumberOfDevelopers) {
      console.log('here');
      await PROJECT_SERVICES.updateProjectStatus(id, 'unsupportedInput');
      await PROJECT_SERVICES.updateProjectRemarks(
        id,
        `DEVELOPERS REQUIRED ${minimumNumberOfDevelopers}`
      );
      sprintPlan.status = 'unsupportedInput';
      sprintPlan.remarks = `DEVELOPERS REQUIRED ${minimumNumberOfDevelopers}`;
    } else {
      await PROJECT_SERVICES.updateProjectStatus(id, 'planned');
      await PROJECT_SERVICES.updateProjectRemarks(id, '');
      sprintPlan.status = 'planned';
      sprintPlan.remarks = '';
    }

    return res
      .status(201)
      .json({ message: 'Project edited successfully', data: sprintPlan });
  } catch (error) {
    const resBody = { message: error.message };
    if (id) {
      resBody.projectId = id;
      await PROJECT_SERVICES.updateProjectStatus(id, 'unsupportedInput');
      await PROJECT_SERVICES.updateProjectRemarks(id, error.message);
      console.log('updated project status and remarks');
    }
    return res.status(500).json(resBody);
  }
};

module.exports = {
  getProject,
  getProjectList,
  createProject,
  editProjectDetailsById,
};
