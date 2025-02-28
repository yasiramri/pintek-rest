// services/userService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (request, h) => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

const getUserById = async (request, h) => {
  const { id } = request.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return h.response('User Not Found').code(404);
    }

    return user;
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

const createUser = async (request, h) => {
  const { username, email, password } = request.payload;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return h.response(newUser).code(201); // Kode status 201 untuk user baru
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
