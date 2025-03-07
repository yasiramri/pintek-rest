const routes = (handler) => [
  {
    method: 'POST',
    path: '/register',
    options: { auth: false },
    handler: handler.register.bind(handler),
  },
  {
    method: 'POST',
    path: '/login',
    options: { auth: false },
    handler: handler.login.bind(handler),
  },
];

module.exports = routes;
