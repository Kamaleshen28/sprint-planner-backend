const projectServices = require('../../src/services/projects');
const { Project, Story, Developer } = require('../../src/models');

describe('Project Services', () => {
  describe('createProject', () => {
    it('should throw an error if Project.create throws an error', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [],
        developers: [],
      };
      const testOwner = 'testOwner';
      jest.spyOn(Project, 'create').mockRejectedValue(new Error('Test Error'));
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).rejects.toThrow('Test Error');
    });

    it('should throw an error if Story.bulkCreate throws an error', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [],
        developers: [],
      };
      const testOwner = 'testOwner';
      jest.spyOn(Project, 'create').mockResolvedValue(mockProject);
      jest
        .spyOn(Story, 'bulkCreate')
        .mockRejectedValue(new Error('Test Error'));
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).rejects.toThrow('Test Error');
    });

    it('should throw an error if Developer.bulkCreate throws an error', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [],
        developers: [],
      };
      const testOwner = 'testOwner';
      jest.spyOn(Project, 'create').mockResolvedValue(mockProject);
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue();
      jest
        .spyOn(Developer, 'bulkCreate')
        .mockRejectedValue(new Error('Test Error'));
      jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).rejects.toThrow('Test Error');
    });

    it('should throw an error if Project.findOne throws an error', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [],
        developers: [],
      };
      const testOwner = 'testOwner';
      jest.spyOn(Project, 'create').mockResolvedValue(mockProject);
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue();
      jest
        .spyOn(Project, 'findByPk')
        .mockRejectedValue(new Error('Test Error'));
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).rejects.toThrow('Test Error');
    });

    it('should return a project if Project.create returns a project', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [{ name: 'story1' }, { name: 'story1' }],
        developers: [{ name: 'developer:1' }, { name: 'developer2' }],
      };
      const testOwner = 'testOwner';
      const mockResult = { id: 1, title: 'Test Project' };
      jest.spyOn(Project, 'create').mockResolvedValue(mockResult);
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Project, 'findByPk').mockResolvedValue(mockResult);
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).resolves.toEqual(mockResult);
    });

    it('should return a project if Project.create returns a project', async () => {
      const mockProject = {
        title: 'Test Project',
        sprintDuration: 2,
        stories: [{ name: 'story1' }, { name: 'story1' }],
        developers: [{ name: 'developer:1' }, { name: 'developer2' }],
      };
      const testOwner = 'testOwner';
      const mockResult = { id: 1, title: 'Test Project' };
      jest.spyOn(Project, 'create').mockResolvedValue(mockResult);
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue();
      jest.spyOn(Project, 'findByPk').mockResolvedValue(mockResult);
      await expect(
        projectServices.createProject(testOwner, mockProject)
      ).resolves.toEqual(mockResult);
    });
  });

  describe('getProject', () => {
    it('should return a project if Project.findOne returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      const mockOwner = 'testOwner';
      jest.spyOn(Project, 'findOne').mockResolvedValue(mockProject);
      await expect(projectServices.getProject(mockOwner, 1)).resolves.toEqual(
        mockProject
      );
    });
  });

  describe('getProjectListByOwner', () => {
    it('should return a list of projects if Project.findAll returns a list of projects', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      const mockOwner = 'testOwner';
      jest.spyOn(Project, 'findAll').mockResolvedValue([mockProject]);
      await expect(
        projectServices.getProjectListByOwner(mockOwner)
      ).resolves.toEqual([mockProject]);
    });
  });

  describe('deleteProject', () => {
    it('should return a project if Project.destroy returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      const mockOwner = 'testOwner';
      jest.spyOn(Project, 'destroy').mockResolvedValue(mockProject);
      await expect(
        projectServices.deleteProject(mockOwner, 1)
      ).resolves.toEqual(mockProject);
    });
  });

  describe('updateProjectStatus', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      jest.spyOn(Project, 'update').mockResolvedValue(mockProject);
      await projectServices.updateProjectStatus(1, 1);
      expect(Project.update).toHaveBeenCalledWith(
        { status: 1 },
        { where: { id: 1 } }
      );
    });
  });

  describe('updateProjectRemarks', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      jest.spyOn(Project, 'update').mockResolvedValue(mockProject);
      await projectServices.updateProjectRemarks(1, 'test');
      expect(Project.update).toHaveBeenCalledWith(
        { remarks: 'test' },
        { where: { id: 1 } }
      );
    });
  });

  describe('updateProjectDetails', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      const mockOwner = 'testOwner';
      jest.spyOn(Project, 'update').mockResolvedValue(mockProject);
      await projectServices.updateProjectDetails(1, mockOwner, {
        title: 'test',
      });
      expect(Project.update).toHaveBeenCalled();
    });
  });

  describe('updateStoryDetails', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      jest.spyOn(Story, 'bulkCreate').mockResolvedValue(mockProject);
      jest.spyOn(Story, 'destroy').mockResolvedValue(mockProject);
      await projectServices.updateStoryDetails(1, [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ]);
      expect(Story.bulkCreate).toHaveBeenCalled();
    });
  });

  describe('updateDeveloperDetails', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      jest.spyOn(Developer, 'bulkCreate').mockResolvedValue(mockProject);
      jest.spyOn(Developer, 'destroy').mockResolvedValue(mockProject);
      await projectServices.updateDeveloperDetails(1, [
        { id: 1, name: 'test' },
        { id: 2, name: 'test2' },
      ]);
      expect(Developer.bulkCreate).toHaveBeenCalled();
    });
  });

  describe('editProject', () => {
    it('should return a project if Project.update returns a project', async () => {
      const mockResultFromFindByPk = { id: 1, title: 'Test Project' };
      jest.spyOn(projectServices, 'updateProjectDetails');
      jest.spyOn(projectServices, 'updateStoryDetails');
      jest.spyOn(projectServices, 'updateDeveloperDetails');
      jest.spyOn(Project, 'findByPk').mockResolvedValue(mockResultFromFindByPk);
      const result = await projectServices.editProject('testOwner', 1, {
        title: 'test',
        stories: [
          { id: 1, name: 'test' },
          { id: 2, name: 'test2' },
        ],
        developers: [
          { id: 1, name: 'test' },
          { id: 2, name: 'test2' },
        ],
      });
      expect(result).toEqual(mockResultFromFindByPk);
    });

    it('should return a project if Project.update returns a project', async () => {
      const mockResultFromFindByPk = { id: 1, title: 'Test Project' };
      jest.spyOn(projectServices, 'updateProjectDetails');
      jest.spyOn(projectServices, 'updateStoryDetails');
      jest.spyOn(projectServices, 'updateDeveloperDetails');
      jest.spyOn(Project, 'findByPk').mockResolvedValue(mockResultFromFindByPk);
      const result = await projectServices.editProject('testOwner', 1, {
        title: 'test',
        stories: [
          { id: 1, name: 'test' },
          { id: 2, name: 'test2' },
        ],
        developers: null,
      });
      expect(result).toEqual(mockResultFromFindByPk);
    });
  });
});
