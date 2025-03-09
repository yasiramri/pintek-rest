const StrukturOrganisasiHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'strukturOrganisasi',
  version: '1.0.0',
  register: async (server, { service }) => {
    const strukturOrganisasiHandler = new StrukturOrganisasiHandler(service);
    server.route(routes(strukturOrganisasiHandler));
  },
};
