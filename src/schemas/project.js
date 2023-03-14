const joi = require('joi');

const getProjectParams = joi.object({
  id: joi.string().uuid().required(),
});

const createProjectRequest = joi.object({
  title: joi.string().required(),
  duration: joi.number().required(),
  sprintDuration: joi.number().required(),
  sprintCapacity: joi.number().required(),
  projectStartDate: joi.date().required(),
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

module.exports = { getProjectParams, createProjectRequest };
