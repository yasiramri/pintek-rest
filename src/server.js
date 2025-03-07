require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Jwt = require('@hapi/jwt');
const path = require('path');

const newsPlugin = require('./api/news');
const authenticationPlugin = require('./api/auth');
const NewsService = require('./services/newsService');
const AuthenticationService = require('./services/authenticationService');
const UserService = require('./services/userService');
const TokenManager = require('./token/TokenManager');
const validator = require('./validators/auth');
const ClientError = require('./exceptions/ClientError');
const ValidationError = require('./exceptions/ValidationError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Inert, Jwt]);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3600,
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: { userId: artifacts.decoded.payload.userId },
      };
    },
  });

  server.auth.default('jwt');

  await server.register([
    {
      plugin: newsPlugin,
      options: {
        service: new NewsService(),
        validator: {},
      },
    },
    {
      plugin: authenticationPlugin,
      options: {
        authenticationService: new AuthenticationService(),
        userService: new UserService(),
        tokenManager: TokenManager,
        validator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof Error) {
      console.error('Error caught:', response);

      if (response instanceof ClientError) {
        return h
          .response({ message: response.message })
          .code(response.statusCode);
      }

      if (response instanceof ValidationError) {
        return h
          .response({ message: response.message })
          .code(response.statusCode);
      }

      return h.response({ message: 'Internal Server Error' }).code(500);
    }

    return h.continue;
  });

  server.route({
    method: 'GET',
    path: '/uploads/newsImages/{filename}',
    handler: {
      directory: {
        path: path.join(__dirname, 'src/uploads/newsImages'),
        listing: false,
      },
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
