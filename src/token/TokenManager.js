const Jwt = require('@hapi/jwt');
const Joi = require('joi');
const InvariantError = require('../exceptions/ClientError');

const tokenPayloadSchema = Joi.object({
  userId: Joi.number().required(),
  username: Joi.string().required(),
});

const validatePayload = (payload) => {
  const { error } = tokenPayloadSchema.validate(payload);
  if (error) {
    throw new InvariantError('Payload token tidak valid');
  }
};

const TokenManager = {
  generateAccessToken: (payload) => {
    validatePayload(payload);
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_SECRET, {
      ttlSec: 3600
    }); // 1 jam
  },

  generateRefreshToken: (payload) => {
    validatePayload(payload);
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_SECRET, {
      ttlSec: 86400,
    }); // 24 jam
  },

  verifyAccessToken: (accessToken) => {
    try {
      const artifacts = Jwt.token.decode(accessToken);
      Jwt.token.verifySignature(artifacts, process.env.ACCESS_TOKEN_SECRET);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError('Access token tidak valid');
    }
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_SECRET);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
