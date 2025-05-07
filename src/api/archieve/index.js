const ArchiveHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'archive',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const archiveHandler = new ArchiveHandler(service, validator);
    server.route(routes(archiveHandler));
  },
};
