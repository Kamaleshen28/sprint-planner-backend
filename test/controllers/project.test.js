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
});
