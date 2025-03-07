const { createNewsSchema, updateNewsSchema } = require('./schema');

const validateCreateNews = (data) => {
  return createNewsSchema.validate(data, { abortEarly: false });
};

// Fungsi untuk memvalidasi data untuk update
const validateUpdateNews = (data) => {
  return updateNewsSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCreateNews,
  validateUpdateNews,
};
