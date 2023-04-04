/* eslint-disable camelcase */
const projectServices = require('../../src/services/projects');
const projectController = require('../../src/controllers/projects');
const projectUtils = require('../../src/utils/projects');

describe('Project Controller', () => {
  describe('getProject', () => {
    it('should return 404 if project not found', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      projectServices.getProject = jest.fn().mockReturnValue(null);
      await projectController.getProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should return 200 if project found', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      projectServices.getProject = jest.fn().mockReturnValue({
        status: 'planned',
        message: 'Project fetched successfully',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'planned',
        message: 'Project fetched successfully',
      });

      await projectController.getProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project fetched successfully',
        data: {
          status: 'planned',
          message: 'Project fetched successfully',
        },
      });
    });

    it('should return 200 if project found and status is unsupportedInput', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      projectServices.getProject = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      await projectController.getProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project Draft',
        data: {
          status: 'unsupportedInput',
          message: 'Project Draft',
        },
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      projectServices.getProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      await projectController.getProject(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('downloadAsCSV', () => {
    it('should return 404 if project not found', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      projectServices.getProject = jest.fn().mockReturnValue(null);
      await projectController.downloadAsCSV(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });

      projectServices.getProject = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      await projectController.downloadAsCSV(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should return 200 if project found', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        setHeader: jest.fn(),
        send: jest.fn(),
      };

      projectServices.getProject = jest.fn().mockReturnValue({
        status: 'planned',
        message: 'Project fetched successfully',
        title: 'project',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'planned',
        message: 'Project fetched successfully',
      });

      projectUtils.convertToCSV = jest.fn().mockReturnValue({
        status: 'planned',
        message: 'Project fetched successfully',
      });

      await projectController.downloadAsCSV(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=project.csv'
      );
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          username: 'test',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.getProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
        message: 'Project Draft',
      });

      await projectController.downloadAsCSV(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('getProjectList', () => {
    it('should return 200 if projects are found', async () => {
      const req = {
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.getProjectListByOwner = jest.fn().mockReturnValue([
        {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
          title: 'test',
          description: 'test',
          status: 'planned',
          createdBy: 'test',
        },
        {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
          title: 'test',
          description: 'test',
          status: 'planned',
          createdBy: 'test',
        },
      ]);

      await projectController.getProjectList(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project list fetched successfully',
        data: [
          {
            id: '5f9f1b9b0b1b9c0b8c8b8b8b',
            title: 'test',
            description: 'test',
            status: 'planned',
            createdBy: 'test',
          },
          {
            id: '5f9f1b9b0b1b9c0b8c8b8b8b',
            title: 'test',
            description: 'test',
            status: 'planned',
            createdBy: 'test',
          },
        ],
      });
    });

    it('should return 404 if no projects are found', async () => {
      const req = {
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.getProjectListByOwner = jest.fn().mockReturnValue([]);

      await projectController.getProjectList(req, res);
      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: 'No project found',
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.getProjectListByOwner = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('Error');
        });

      await projectController.getProjectList(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('createProject', () => {
    it('should return 201 if project is created', async () => {
      const req = {
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.createProject = jest.fn().mockReturnValue({
        id: '5f9f1b9b0b1b9c0b8c8b8b8b',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        minimumNumberOfDevelopers: 1,
      });

      projectServices.updateProjectStatus = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
      });

      projectServices.updateProjectRemarks = jest
        .fn()
        .mockReturnValue('Please add 1 developers to plan this project');

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project created successfully',
        data: {
          minimumNumberOfDevelopers: 1,
          remarks: 'Please add 1 developers to plan this project',
          status: 'unsupportedInput',
        },
      });
    });

    it('should return 201 if project is created and it goes to planned state', async () => {
      const req = {
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.createProject = jest.fn().mockReturnValue({
        id: '5f9f1b9b0b1b9c0b8c8b8b8b',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({});

      projectServices.updateProjectStatus = jest.fn().mockReturnValue({
        status: 'planned',
      });

      projectServices.updateProjectRemarks = jest.fn().mockReturnValue('');

      await projectController.createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project created successfully',
        data: {
          remarks: '',
          status: 'planned',
        },
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.createProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      projectUtils.calculateSprint = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      await projectController.createProject(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });

    it('should return 500 if error is thrown when projectId is present but some error occured', async () => {
      const req = {
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const projectId = '5f9f1b9b0b1b9c0b8c8b8b8b';

      projectServices.createProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      projectUtils.calculateSprint = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      projectServices.updateProjectStatus = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
      });

      projectServices.updateProjectRemarks = jest.fn().mockReturnValue('Error');

      await projectController.createProject(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('editProjectDetailsById', () => {
    it('should return 201 if project is edited', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockReturnValue({
        title: 'test',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({
        minimumNumberOfDevelopers: 1,
      });

      projectServices.updateProjectStatus = jest.fn().mockReturnValue({
        status: 'unsupportedInput',
      });

      projectServices.updateProjectRemarks = jest
        .fn()
        .mockReturnValue('Please add 1 developers to plan this project');

      await projectController.editProjectDetailsById(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project edited successfully',
        data: {
          minimumNumberOfDevelopers: 1,
          remarks: 'Please add 1 developers to plan this project',
          status: 'unsupportedInput',
        },
      });
    });
    it('should return 201 if project is edited', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockReturnValue({
        title: 'test',
      });

      projectUtils.calculateSprint = jest.fn().mockReturnValue({});

      projectServices.updateProjectStatus = jest.fn().mockReturnValue({
        status: 'planned',
      });

      projectServices.updateProjectRemarks = jest.fn().mockReturnValue('');

      await projectController.editProjectDetailsById(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project edited successfully',
        data: {
          remarks: '',
          status: 'planned',
        },
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        body: {
          stories: [
            {
              title: 'test',
              description: 'test',
              points: 1,
            },
          ],
          developers: [
            {
              name: 'test',
            },
          ],
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      await projectController.editProjectDetailsById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error',
        projectId: '5f9f1b9b0b1b9c0b8c8b8b8b',
      });
    });
  });

  describe('deleteProject', () => {
    it('should return 200 if project is deleted', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        user: {
          username: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.deleteProject = jest.fn();

      await projectController.deleteProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project deleted successfully',
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        user: {
          username: 'test',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.deleteProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      await projectController.deleteProjectById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('bookmarkProjectById', () => {
    it('should return 200 if project is bookmarked', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        user: {
          username: 'test',
        },
        body: {
          isBookmarked: true,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockReturnValue({
        isBookmarked: true,
      });

      await projectController.bookmarkProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project bookmarked successfully',
      });
    });

    it('should return 404 if project is not found', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        user: {
          username: 'test',
        },
        body: {
          isBookmarked: true,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockReturnValue(null);

      await projectController.bookmarkProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project not found',
      });
    });

    it('should return 500 if error is thrown', async () => {
      const req = {
        params: {
          id: '5f9f1b9b0b1b9c0b8c8b8b8b',
        },
        user: {
          username: 'test',
        },
        body: {
          isBookmarked: true,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      projectServices.editProject = jest.fn().mockImplementation(() => {
        throw new Error('Error');
      });

      await projectController.bookmarkProjectById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });
});
