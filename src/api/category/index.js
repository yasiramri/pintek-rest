const CategoryHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'categories',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const categoryHandler = new CategoryHandler(service, validator);
    server.route(routes(categoryHandler));
  },
};
