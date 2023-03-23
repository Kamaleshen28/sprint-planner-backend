const joi = require('joi');

const getProjectParams = joi.object({
  id: joi.string().uuid().required(),
});

const listProjectsQuery = joi.object({}); // empty

const createProjectRequest = joi.object({
  title: joi.string().required(),
  duration: joi.number().required(),
  sprintDuration: joi.number().required(),
  sprintCapacity: joi.number().required(),
  projectStartDate: joi.date().required(),
  givenTotalDuration: joi.number(),
  stories: joi.array().items(
    joi.object({
      id: joi.number().required(),
      title: joi.string().required(),
      description: joi.string().required(),
      dependencies: joi.array().items(joi.number()),
      storyPoints: joi.number().required(),
      preAssignedDeveloperId: joi.number(),
    })
  ),
  developers: joi.array().items(
    joi.object({
      id: joi.number().required(),
      name: joi.string().required(),
      capacity: joi.number().required(),
    })
  ),
});

const deleteProjectParams = joi.object({
  id: joi.string().uuid().required(),
});

module.exports = {
  getProjectParams,
  listProjectsQuery,
  createProjectRequest,
  deleteProjectParams,
};
