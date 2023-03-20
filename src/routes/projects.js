const express = require('express');
const { PROJECT_CONTROLLER } = require('../controllers');
// const {
//   validateRequest,
//   validateParams,
//   validateQuery,
// } = require('../middlewares/validate');

// const {
//   createProjectRequest,
//   getProjectParams,
//   listProjectsQuery,
// } = require('../schemas/project');

const validationMiddleware = require('../middlewares/validate');
const validationSchemas = require('../schemas/project');

const router = express.Router();

router.get(
  '/',
  validationMiddleware.validateQuery(validationSchemas.listProjectsQuery),
  PROJECT_CONTROLLER.getProjectList
); // fetches list of projects

router.get(
  '/:id',
  validationMiddleware.validateParams(validationSchemas.getProjectParams),
  PROJECT_CONTROLLER.getProject
); // fetches a single project

router.post(
  '/',
  validationMiddleware.validateBody(validationSchemas.createProjectRequest),
  PROJECT_CONTROLLER.createProject
); // creates a new project
router.put(
  '/:id',
  validationMiddleware.validateBody(validationSchemas.createProjectRequest),
  PROJECT_CONTROLLER.editProjectDetailsById
); // edit an existing project details by id

module.exports = router;
