const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');

class AuthenticationService {
  // Menambahkan refresh token ke database
  async addRefreshToken(token) {
    await prisma.authentication.create({
      data: {
        token,
      },
    });
  }

  // Memverifikasi apakah refresh token ada di database
  async verifyRefreshToken(token) {
    const existingToken = await prisma.authentication.findUnique({
      where: { token },
    });

    if (!existingToken) {
      throw new NotFoundError('Invalid refresh token');
    }
  }

  // Menghapus refresh token dari database setelah digunakan
  async deleteRefreshToken(token) {
    await prisma.authentication.delete({
      where: { token },
    });
  }
}

module.exports = AuthenticationService;
