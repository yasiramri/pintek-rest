const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');

const validatePostAuthentication = (data) => {
  const { error, value } = PostAuthenticationPayloadSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(', '));
  }
  return value;
};

const validatePutAuthentication = (data) => {
  const { error, value } = PutAuthenticationPayloadSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(', '));
  }
  return value;
};

const validateDeleteAuthentication = (data) => {
  const { error, value } = DeleteAuthenticationPayloadSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(error.details.map((err) => err.message).join(', '));
  }
  return value;
};

module.exports = {
  validatePostAuthentication,
  validatePutAuthentication,
  validateDeleteAuthentication,
};
