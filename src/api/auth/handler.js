const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthentication(request.payload);
      console.log('Payload validated:', request.payload);

      const { identifier, password } = request.payload;

      try {
        const user = await this._usersService.verifyUserCredentials(
          identifier,
          password
        );
        console.log('User found:', user);

        const accessToken = this._tokenManager.generateAccessToken({
          id: user.id,
        });
        const refreshToken = this._tokenManager.generateRefreshToken({
          id: user.id,
        });
        console.log('Tokens generated:', { accessToken, refreshToken });

        await this._authenticationsService.addRefreshToken(refreshToken);
        console.log('Refresh token stored in DB');

        return h
          .response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: { accessToken, refreshToken },
          })
          .code(201);
      } catch (error) {
        if (error.message === 'Invalid credentials') {
          return h
            .response({
              status: 'fail',
              message: 'Incorrect username/email or password',
            })
            .code(401);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in postAuthenticationHandler:', error);
      return h
        .response({
          status: 'error',
          message: 'Internal server error',
        })
        .code(500);
    }
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    // Hapus refresh token lama dan buat yang baru
    await this._authenticationsService.deleteRefreshToken(refreshToken);
    const newRefreshToken = this._tokenManager.generateRefreshToken({ id });
    await this._authenticationsService.addRefreshToken(newRefreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthentication(request.payload);
      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return h
        .response({
          status: 'success',
          message: 'Refresh token berhasil dihapus',
        })
        .code(200);
    } catch (error) {
      console.error('Error in deleteAuthenticationHandler:', error);
      return h
        .response({
          status: 'fail',
          message: error.message || 'Internal server error',
        })
        .code(error.message.includes('Refresh token tidak valid') ? 403 : 500);
    }
  }
}

module.exports = AuthenticationsHandler;
