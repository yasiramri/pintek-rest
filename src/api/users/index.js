// index.js
const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'userAuth',
  version: '1.0.0',
  register: async (server) => {
    const userHandler = new UserHandler();
    server.route(routes(userHandler));
  },
};
