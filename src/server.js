// server.js
const Hapi = require('@hapi/hapi');
const routes = require('./utils/routes');

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
  });

  // Menambahkan routes dari utils/routes.js
  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
