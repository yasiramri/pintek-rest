const { StrukturOrganisasiSchema } = require('./schema');
const ValidationError = require('../../exceptions/ValidationError');

const validateStrukturOrganisasiPayload = (payload) => {
  const { error } = StrukturOrganisasiSchema.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    throw new ValidationError(
      error.details.map((detail) => detail.message).join(', ')
    );
  }
};

module.exports = { validateStrukturOrganisasiPayload };
