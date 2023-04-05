const { PROJECT_SERVICES } = require('../services');
const PROJECT_UTILS = require('../utils/projects');

// get project by id
const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PROJECT_SERVICES.getProject(req.user.username, id);
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
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
        message: 'Project fetched successfully',
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

// download project as csv: set content-type to text/csv
const downloadAsCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PROJECT_SERVICES.getProject(req.user.username, id);
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
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
      const csvString = PROJECT_UTILS.convertToCSV(sprintCalculation);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${result.title}.csv`
      );
      // res.setHeader('filename', `${result.title}.csv`);
      res.set('Content-Type', 'text/csv');
      res.set(
        'Content-Disposition',
        `attachment; filename=${result.title}.csv`
      );
      let date = new Date();
      date = date.toISOString();
      // eslint-disable-next-line prefer-destructuring
      date = date.split('T')[0];
      res.set('filename', `${date}-${result.title}.csv`);
      return res.send(csvString);
    }
    return res.status(404).json({ message: 'Project not found' });
  } catch (error) {
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
        `Please add ${minimumNumberOfDevelopers} developers to plan this project`
      );
      sprintCalculation.status = 'unsupportedInput';
      sprintCalculation.remarks = `Please add ${minimumNumberOfDevelopers} developers to plan this project`;
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

const calculateDuration = async (req, res) => {
  try {
    // data format to be validated
    console.log('calculating duration');
    const { sprintDuration, sprintCapacity, stories, developers } = req.body;
    const project = {
      stories,
      developers,
      sprintDuration,
      sprintCapacity,
    };
    // do sprint calculation on this data
    let sprintCalculation = PROJECT_UTILS.calculateSprint(
      JSON.parse(JSON.stringify(project))
    );
    console.log('Sprint calculation done');
    console.log(sprintCalculation);

    const { minimumNumberOfDevelopers } = sprintCalculation;
    if (!minimumNumberOfDevelopers) {
      sprintCalculation.estimatedDuration =
        sprintCalculation.sprints.length * sprintDuration;
      sprintCalculation = {
        estimatedDuration: sprintCalculation.estimatedDuration,
      };
    } else {
      sprintCalculation.status = 'unsupportedInput';
      sprintCalculation.remarks = `Please add ${minimumNumberOfDevelopers} developers to plan this project`;
      sprintCalculation = {
        remarks: sprintCalculation.remarks,
      };
    }
    return res.status(201).json({
      message: 'Project created successfully',
      data: sprintCalculation,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
        `Please add ${minimumNumberOfDevelopers} developers to plan this project`
      );
      sprintPlan.status = 'unsupportedInput';
      sprintPlan.remarks = `Please add ${minimumNumberOfDevelopers} developers to plan this project`;
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

const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    await PROJECT_SERVICES.deleteProject(req.user.username, id);
    return res.status(204).json({ message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const bookmarkProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;
    const { isBookmarked } = req.body;
    const result = await PROJECT_SERVICES.editProject(username, id, {
      isBookmarked,
    });
    if (result) {
      return res
        .status(200)
        .json({ message: 'Project bookmarked successfully' });
    }
    return res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProject,
  getProjectList,
  createProject,
  editProjectDetailsById,
  deleteProjectById,
  downloadAsCSV,
  bookmarkProjectById,
  calculateDuration,
};
