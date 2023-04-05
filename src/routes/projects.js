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

router.get(
  '/:id/save',
  validationMiddleware.validateParams(validationSchemas.getProjectParams),
  PROJECT_CONTROLLER.downloadAsCSV
); // fetches a single project as csv

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
router.delete(
  '/:id',
  validationMiddleware.validateParams(validationSchemas.deleteProjectParams),
  PROJECT_CONTROLLER.deleteProjectById
); // delete an existing project by id

router.put(
  '/:id/bookmark',
  validationMiddleware.validateParams(validationSchemas.getProjectParams),
  validationMiddleware.validateBody(validationSchemas.bookmarkProjectRequest),
  PROJECT_CONTROLLER.bookmarkProjectById
); // bookmark an existing project by id

router.post(
  '/calculateDuration',
  validationMiddleware.validateBody(
    validationSchemas.getEstimatedProjectDuration
  ),
  PROJECT_CONTROLLER.calculateDuration
);

module.exports = router;
