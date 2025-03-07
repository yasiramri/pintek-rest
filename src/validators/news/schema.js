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
  image: Joi.any().meta({ swaggerType: 'file' }).optional(),
});

module.exports = {
  createNewsSchema,
  updateNewsSchema,
};
