const ClientError = require('../../exceptions/ClientError');

class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthentication(request, h) {
    const { error } = this._validator.validatePostAuthentication(
      request.payload
    );
    if (error) {
      throw new ClientError(error.details.map((d) => d.message).join(', '));
    }

    const { identifier, password } = request.payload;
    const user = await this._userService.verifyUserCredentials(
      identifier,
      password
    );
    const accessToken = this._tokenManager.generateAccessToken({
      userId: user.id,
      username: user.username,
    });
    const refreshToken = this._tokenManager.generateRefreshToken({
      userId: user.id,
      username: user.username,
    });

    await this._authenticationService.addAuthentication(
      user.id,
      accessToken,
      refreshToken
    );
    return h.response({ accessToken, refreshToken }).code(201);
  }

  async putAuthentication(request, h) {
    const { error } = this._validator.validatePutAuthentication(
      request.payload
    );
    if (error) {
      throw new ClientError(error.details.map((d) => d.message).join(', '));
    }

    const { refreshToken } = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    const { userId, username } =
      this._tokenManager.verifyRefreshToken(refreshToken);
    const newAccessToken = this._tokenManager.generateAccessToken({
      userId,
      username,
    });

    await this._authenticationService.updateAccessToken(
      refreshToken,
      newAccessToken
    );
    return h.response({ accessToken: newAccessToken }).code(200);
  }

  async deleteAuthentication(request, h) {
    const { error } = this._validator.validateDeleteAuthentication(
      request.payload
    );
    if (error) {
      throw new ClientError(error.details.map((d) => d.message).join(', '));
    }

    const { refreshToken } = request.payload;
    await this._authenticationService.deleteAuthentication(refreshToken);
    return h.response({ message: 'Refresh token deleted' }).code(200);
  }
}

module.exports = AuthenticationHandler;
