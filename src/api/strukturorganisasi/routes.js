const auth = require('../auth');

const routes = (handler) => [
  {
    method: 'GET',
    path: '/struktur-organisasi',
    handler: handler.getAllStrukturOrganisasi.bind(handler),
  },
  {
    method: 'GET',
    path: '/struktur-organisasi/{id}',
    handler: handler.getStrukturOrganisasiById.bind(handler),
  },
  {
    method: 'POST',
    path: '/struktur-organisasi',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760, // 10MB
      },
      handler: handler.createStrukturOrganisasi.bind(handler),
    },
  },
  {
    method: 'PUT',
    path: '/struktur-organisasi/{id}',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760,
      },
      handler: handler.updateStrukturOrganisasi.bind(handler),
    },
  },
  {
    method: 'DELETE',
    path: '/struktur-organisasi/{id}',
    handler: handler.deleteStrukturOrganisasi.bind(handler),
  },
  {
    method: 'POST',
    path: '/struktur-organisasi/upload',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760,
      },
      handler: handler.uploadProfileImage.bind(handler),
    },
  },
  {
    method: 'GET',
    path: '/uploads/strukturOrganisasi/{filename}',
    handler: {
      directory: {
        path: './src/uploads/strukturOrganisasi',
        listing: true,
      },
    },
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
