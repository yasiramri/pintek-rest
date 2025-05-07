const routes = (handler) => [
  {
    method: 'GET',
    path: '/archive',
    handler: handler.getArchivedArticlesHandler,
  },
  {
    method: 'POST',
    path: '/archive/restore/{id}',
    handler: handler.restoreArticleHandler,
  },
  {
    method: 'DELETE',
    path: '/archive/hard-delete/{id}',
    handler: handler.hardDeleteArticleHandler,
  },
];

module.exports = routes;
