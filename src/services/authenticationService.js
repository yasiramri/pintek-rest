const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');

class AuthenticationService {
  // Menyimpan token autentikasi baru
  async addToken(userId, accessToken, refreshToken) {
    return prisma.authentication.create({
      data: {
        userId,
        accessToken,
        refreshToken,
      },
    });
  }

  // Verifikasi apakah accessToken ada di database
  async verifyAccessToken(accessToken) {
    const authentication = await prisma.authentication.findUnique({
      where: { accessToken },
    });

    if (!authentication) {
      throw new NotFoundError('Access Token not found');
    }

    return authentication;
  }

  // Verifikasi apakah refreshToken ada di database
  async verifyRefreshToken(refreshToken) {
    const authentication = await prisma.authentication.findUnique({
      where: { refreshToken },
    });

    if (!authentication) {
      throw new NotFoundError('Refresh Token not found');
    }

    return authentication;
  }

  // Menghapus token (logout/revoke)
  async deleteToken(refreshToken) {
    try {
      return await prisma.authentication.delete({
        where: { refreshToken },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Refresh Token not found');
      }
      throw error;
    }
  }
}

module.exports = AuthenticationService;
