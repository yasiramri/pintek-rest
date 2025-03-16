const routes = (handler) => [
  {
    method: 'GET',
    path: '/categories',
    handler: handler.getAllCategories.bind(handler),
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: handler.getCategoryById.bind(handler),
  },
  {
    method: 'POST',
    path: '/categories',
    options: {
      auth: 'news_jwt',
    },
    handler: handler.createCategory.bind(handler),
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    options: {
      auth: 'news_jwt',
    },
    handler: handler.updateCategory.bind(handler),
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    options: {
      auth: 'news_jwt',
    },
    handler: handler.deleteCategory.bind(handler),
  },
];

module.exports = routes;
