const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_SECRET, {
      ttlSec: parseInt(process.env.ACCESS_TOKEN_AGE),
    }),

  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_SECRET, {
      ttlSec: parseInt(process.env.REFRESH_TOKEN_AGE),
    }),

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_SECRET);

      // ✅ Tambahkan pengecekan kadaluarsa manual
      const now = Date.now() / 1000; // dalam detik
      const exp = artifacts.decoded.payload.exp;

      if (exp && exp < now) {
        throw new InvariantError('Refresh token expired');
      }

      return artifacts.decoded.payload;
    } catch (error) {
      console.error('[TokenManager] Refresh token invalid:', error.message);
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
