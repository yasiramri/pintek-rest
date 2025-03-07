const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');

const validatePostAuthentication = (data) => {
  return PostAuthenticationPayloadSchema.validate(data, { abortEarly: false });
};

const validatePutAuthentication = (data) => {
  return PutAuthenticationPayloadSchema.validate(data, { abortEarly: false });
};

const validateDeleteAuthentication = (data) => {
  return DeleteAuthenticationPayloadSchema.validate(data, {
    abortEarly: false,
  });
};

module.exports = {
  validatePostAuthentication,
  validatePutAuthentication,
  validateDeleteAuthentication,
};
