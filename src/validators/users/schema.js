const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Username must be a string',
    'string.alphanum': 'Username can only contain alphanumeric characters',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'string.base': 'Username or Email must be a string',
    'any.required': 'Username or Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
