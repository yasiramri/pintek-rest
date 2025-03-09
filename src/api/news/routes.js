const auth = require('../auth');

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
        maxBytes: 10485760, // 10MB
      },
      handler: handler.createNews.bind(handler),
      auth: 'news_jwt',
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
      auth: 'news_jwt',
    },
  },
  {
    method: 'GET',
    path: '/uploads/newsImages/{filename}',
    handler: {
      directory: {
        path: './src/uploads/newsImages',
        listing: true, // Biarkan true jika ingin melihat daftar file di browser
      },
    },
    options: {
      auth: false, // Tidak memerlukan autentikasi untuk melihat gambar
    },
  },
  {
    method: 'PUT',
    path: '/news/{id}',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
        maxBytes: 10485760, // 10MB
      },
      handler: handler.updateNews.bind(handler),
      auth: 'news_jwt',
    },
  },
];

module.exports = routes;
