// test the validate middleware

const {
  validateBody,
  validateParams,
  validateQuery,
} = require('../../src/middlewares/validate');
const validationSchemas = require('../../src/schemas/project');

describe('validate middleware', () => {
  describe('validateQuery', () => {
    it('should validate query', () => {
      const req = {
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      validateQuery(validationSchemas.listProjectsQuery)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should throw error if query is invalid', () => {
      const req = {
        query: [],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      validateQuery(validationSchemas.listProjectsQuery)(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: '"value" must be of type object',
      });
    });
  });
});
