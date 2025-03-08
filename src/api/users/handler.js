// handler.js
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, email } = request.payload;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this._service.addUser(username, email, hashedPassword);

      return h
        .response({
          status: 'success',
          message: 'User berhasil ditambahkan',
          data: {
            userId: user.id,
          },
        })
        .code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(400);
      }

      console.error(error); // Log error untuk debugging
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);

      return h
        .response({
          status: 'success',
          data: { user },
        })
        .code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(404);
      }

      console.error(error); // Logging error untuk debugging
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }
}

module.exports = UserHandler;
