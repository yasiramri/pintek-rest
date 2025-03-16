const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ValidationError = require('../../exceptions/ValidationError');
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require('../../validators/category');

class CategoryHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getAllCategories(request, h) {
    try {
      const categories = await this._service.getAllCategories();
      return h.response(categories).code(200);
    } catch (error) {
      return h.response({ message: error.message }).code(500);
    }
  }

  async getCategoryById(request, h) {
    try {
      const { id } = request.params;
      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const category = await this._service.getCategoryById(id);
      return h.response(category).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(404);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async createCategory(request, h) {
    try {
      const { error } = validateCreateCategory(request.payload);
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      const { name } = request.payload;
      const category = await this._service.createCategory(name);

      return h.response(category).code(201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(400);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async updateCategory(request, h) {
    try {
      const { id } = request.params;
      const { name } = request.payload;

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const { error } = validateUpdateCategory(request.payload);
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      const updatedCategory = await this._service.updateCategory(id, name);
      return h.response(updatedCategory).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(404);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async deleteCategory(request, h) {
    try {
      const { id } = request.params;
      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      await this._service.deleteCategory(id);
      return h.response({ message: 'Category deleted successfully' }).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(404);
      }
      return h.response({ message: error.message }).code(500);
    }
  }
}

module.exports = CategoryHandler;
