const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Category name must be a string',
    'string.min': 'Category name should have at least 3 characters',
    'any.required': 'Category name is required',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).optional().messages({
    'string.base': 'Category name must be a string',
    'string.min': 'Category name should have at least 3 characters',
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
