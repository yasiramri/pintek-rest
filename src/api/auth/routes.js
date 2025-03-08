const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth/login',
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/auth/token',
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/auth/logout',
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
