const Joi = require('joi');

const createNewsSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title should have at least 3 characters',
    'any.required': 'Title is required',
  }),
  content: Joi.string().min(10).required().messages({
    'string.base': 'Content must be a string',
    'string.min': 'Content should have at least 10 characters',
    'any.required': 'Content is required',
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': 'Category ID must be a number',
    'number.integer': 'Category ID must be an integer',
    'number.positive': 'Category ID must be a positive number',
    'any.required': 'Category ID is required',
  }),

  isFeatured: Joi.boolean().optional().default(false).messages({
    'boolean.base': 'isFeatured must be a boolean',
  }),
  image: Joi.any().meta({ swaggerType: 'file' }).optional().messages({
    'any.required': 'Image file is required',
  }),
});

const updateNewsSchema = Joi.object({
  title: Joi.string().min(3).optional().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title should have at least 3 characters',
  }),
  content: Joi.string().min(10).optional().messages({
    'string.base': 'Content must be a string',
    'string.min': 'Content should have at least 10 characters',
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    'number.base': 'Category ID must be a number',
    'number.integer': 'Category ID must be an integer',
    'number.positive': 'Category ID must be a positive number',
  }),
  isFeatured: Joi.boolean().optional().messages({
    'boolean.base': 'isFeatured must be a boolean',
  }),
  image: Joi.any().meta({ swaggerType: 'file' }).optional(),
});

module.exports = {
  createNewsSchema,
  updateNewsSchema,
};
