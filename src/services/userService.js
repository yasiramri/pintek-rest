const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');
const ValidationError = require('../exceptions/ValidationError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UserService {
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }, // Pastikan id diubah menjadi angka jika tipe datanya INTEGER di database
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async getUserByUsernameOrEmail(identifier) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async addUser(username, email, hashedPassword) {
    try {
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError('Username or Email already exists');
      }
      throw error;
    }
  }

  async verifyNewUsername(identifier, password) {
    const user = await this.getUserByUsernameOrEmail(identifier);
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new AuthenticationError('Invalid username/email or password');
    }

    return user;
  }

  async verifyUserCredentials(identifier, password) {
    try {
      const user = await this.getUserByUsernameOrEmail(identifier);
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
