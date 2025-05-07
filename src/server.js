require('dotenv-safe').config(); // Memastikan env variabel tersedia
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Jwt = require('@hapi/jwt');
const path = require('path');
const winston = require('winston');
const HapiRateLimit = require('hapi-rate-limit');

const ClientError = require('./exceptions/ClientError');
const { PrismaClient } = require('@prisma/client');

// news
const news = require('./api/news');
const NewsService = require('./services/newsService');
const NewsValidator = require('./validators/news');

// category
const category = require('./api/category');
const CategoryService = require('./services/categoryService');
const CategoryValidator = require('./validators/category');

// user
const users = require('./api/users');
const UsersService = require('./services/userService');
const UsersValidator = require('./validators/users');

// authentications
const authentications = require('./api/auth');
const AuthenticationsService = require('./services/authenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validators/auth');

// struktur organisasi
const strukturorganisasi = require('./api/strukturorganisasi');
const StrukturOrganisasiService = require('./services/strukturOrganisasiService');
const StrukturOrganisasiValidator = require('./validators/strukturOrganisasi');

// Archive
const archive = require('./api/archieve');
const ArchiveService = require('./services/archiveService');

const prisma = new PrismaClient();

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Simpan ke file
    new winston.transports.Console(), // Pastikan ini aktif untuk log ke terminal
  ],
});

const init = async () => {
  const newsService = new NewsService();
  const usersService = new UsersService();
  const categoryService = new CategoryService();
  const authenticationsService = new AuthenticationsService();
  const strukturOrganisasi = new StrukturOrganisasiService();
  const archiveService = new ArchiveService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Inert, Jwt]);

  // Konfigurasi autentikasi JWT
  server.auth.strategy('token_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: parseInt(process.env.ACCESS_TOKEN_AGE),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Mendaftarkan plugin
  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: news,
      options: {
        service: newsService,
        validator: NewsValidator,
      },
    },
    {
      plugin: category,
      options: {
        service: categoryService,
        validator: CategoryValidator,
      },
    },
    {
      plugin: strukturorganisasi,
      options: {
        service: strukturOrganisasi,
        validator: StrukturOrganisasiValidator,
      },
    },
    {
      plugin: archive,
      options: {
        service: archiveService,
      },
    },
  ]);

  // Middleware Rate Limiting
  await server.register({
    plugin: HapiRateLimit,
    options: {
      userLimit: 500, // Maksimal 500 request per IP per jam
      pathLimit: 200, // Maksimal 200 request per endpoint per jam
      headers: true, // Berikan informasi batas ke pengguna
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);

  // Graceful shutdown untuk menutup koneksi Prisma saat server dihentikan
  const gracefulShutdown = async () => {
    console.log('Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
};

init();
