// handler.js
const UserService = require('./userService');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const ValidationError = require('../exceptions/ValidationError');

class UserHandler {
  constructor() {
    this._service = new UserService();
  }

  async register(request, h) {
    const { username, email, password } = request.payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this._service.createUser(username, email, hashedPassword);
      return h.response({ id: user.id, username: user.username, email: user.email }).code(201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }

  async login(request, h) {
    const { identifier, password } = request.payload;

    try {
      const user = await this._service.verifyUser(identifier, password, bcrypt);

      const token = Jwt.token.generate(
        {
          userId: user.id,
          username: user.username,
        },
        {
          key: 'your_jwt_secret_here',
          algorithm: 'HS256',
        },
        {
          ttlSec: 3600,
        }
      );

      return h.response({ token }).code(200);
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }
}

module.exports = UserHandler;