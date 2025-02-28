const newsService = require('../services/newsService');
const userService = require('../services/userService');

const routes = [
  {
    method: 'GET',
    path: '/news',
    handler: newsService.getAllNews,
  },
  {
    method: 'GET',
    path: '/news/{id}',
    handler: newsService.getNewsById,
  },

  // Route untuk membuat berita baru
  {
    method: 'POST',
    path: '/news',
    handler: newsService.createNews,
  },

  // Route untuk mendapatkan semua user
  {
    method: 'GET',
    path: '/users',
    handler: userService.getAllUsers,
  },

  // Route untuk mendapatkan user berdasarkan ID
  {
    method: 'GET',
    path: '/users/{id}',
    handler: userService.getUserById,
  },

  // Route untuk membuat user baru
  {
    method: 'POST',
    path: '/users',
    handler: userService.createUser,
  },
];

module.exports = routes;
