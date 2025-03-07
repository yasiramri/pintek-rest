class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 422; // Unprocessable Entity
  }
}

module.exports = ValidationError;
