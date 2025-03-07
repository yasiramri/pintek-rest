const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth/login',
    options: { auth: false },
    handler: handler.postAuthentication.bind(handler),
  },
  {
    method: 'PUT',
    path: '/auth/token',
    options: { auth: false },
    handler: handler.putAuthentication.bind(handler),
  },
  {
    method: 'DELETE',
    path: '/auth/logout',
    options: { auth: false },
    handler: handler.deleteAuthentication.bind(handler),
  },
];

module.exports = routes;
