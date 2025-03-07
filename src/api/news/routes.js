const routes = (handler) => [
  {
    method: 'GET',
    path: '/news',
    handler: handler.getAllNews.bind(handler), // Menghubungkan handler dengan rute
  },
  {
    method: 'GET',
    path: '/news/{id}',
    handler: handler.getNewsById.bind(handler),
  },
  {
    method: 'PUT',
    path: '/news/{id}',
    handler: handler.updateNews.bind(handler),
  },
  {
    method: 'DELETE',
    path: '/news/{id}',
    handler: handler.deleteNews.bind(handler),
  },
  {
    method: 'POST',
    path: '/news',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760, // 10MB (sesuai kebutuhan)
      },
      handler: handler.createNews.bind(handler),
    },
  },
  {
    method: 'POST',
    path: '/news/upload',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760,
      },
      handler: handler.uploadImage.bind(handler),
    },
  },
];

module.exports = routes;
