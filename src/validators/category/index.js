const { createCategorySchema, updateCategorySchema } = require('./schema');

const validateCreateCategory = (data) => {
  return createCategorySchema.validate(data, { abortEarly: false });
};

const validateUpdateCategory = (data) => {
  return updateCategorySchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
};
