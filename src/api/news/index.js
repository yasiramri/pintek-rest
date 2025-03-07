const NewsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'news',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const newsHandler = new NewsHandler(service, validator);
    server.route(routes(newsHandler));
  },
};
