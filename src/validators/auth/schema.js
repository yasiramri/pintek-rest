const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'string.base': 'Username or Email must be a string',
    'any.required': 'Username or Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': 'Refresh Token must be a string',
    'any.required': 'Refresh Token is required',
  }),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.base': 'Refresh Token must be a string',
    'any.required': 'Refresh Token is required',
  }),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
