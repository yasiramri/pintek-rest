class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = 400; // Bad Request
  }
}

module.exports = ClientError;
