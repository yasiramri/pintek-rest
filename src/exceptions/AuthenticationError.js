class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401; // Unauthorized
  }
}

module.exports = AuthenticationError;
