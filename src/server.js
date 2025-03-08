require('dotenv-safe').config(); // Memastikan env variabel tersedia
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Jwt = require('@hapi/jwt');
const path = require('path');
const winston = require('winston');
const HapiRateLimit = require('hapi-rate-limit');

const newsPlugin = require('./api/news');
const authenticationPlugin = require('./api/auth');
const NewsService = require('./services/newsService');
const AuthenticationService = require('./services/authenticationService');
const UserService = require('./services/userService');
const TokenManager = require('./token/tokenManager');
const validator = require('./validators/auth');
const ClientError = require('./exceptions/ClientError');
const ValidationError = require('./exceptions/ValidationError');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Konfigurasi logger menggunakan Winston
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
});

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Inert, Jwt, HapiRateLimit]);

  // Konfigurasi autentikasi JWT
  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 3600, // Token berlaku selama 1 jam
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { userId: artifacts.decoded.payload.userId },
    }),
  });

  server.auth.default('jwt');

  // Mendaftarkan plugin untuk news dan authentication
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

  // Middleware Rate Limiting
  await server.register({
    plugin: HapiRateLimit,
    options: {
      userLimit: 100, // Maksimal 100 request per IP
      pathLimit: 50, // Maksimal 50 request per endpoint
      headers: false,
    },
  });

  // Middleware global untuk menangani error
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof Error) {
      logger.error({ message: response.message, stack: response.stack });

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

  // Endpoint untuk menampilkan gambar yang diunggah
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

  // Graceful shutdown untuk menutup koneksi Prisma saat server dihentikan
  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
  });
};

init();
