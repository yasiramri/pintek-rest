const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ValidationError = require('../../exceptions/ValidationError');
const fs = require('fs');
const Path = require('path');
const Boom = require('@hapi/boom');
const {
  validateStrukturOrganisasiPayload,
} = require('../../validators/strukturOrganisasi');

class StrukturOrganisasiHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getAllStrukturOrganisasi(request, h) {
    try {
      const strukturOrganisasi = await this._service.getAllStrukturOrganisasi();
      return h.response(strukturOrganisasi).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async getStrukturOrganisasiById(request, h) {
    try {
      const { id } = request.params;
      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const struktur = await this._service.getStrukturOrganisasiById(id);
      if (!struktur) {
        throw new NotFoundError('Struktur Organisasi not found');
      }
      return h.response(struktur).code(200);
    } catch (error) {
      if (error instanceof ClientError || error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async createStrukturOrganisasi(request, h) {
    try {
      // Validasi hanya untuk "nama" dan "jabatan"
      validateStrukturOrganisasiPayload({
        nama: request.payload.nama,
        jabatan: request.payload.jabatan,
      });

      const { nama, jabatan } = request.payload;
      let profileImage = null;

      // Menangani file upload jika ada
      if (request.payload.profileImage) {
        const image = request.payload.profileImage;
        const imageName = Date.now() + Path.extname(image.hapi.filename);
        const imageDir = './src/uploads/strukturOrganisasi/';

        // Pastikan direktori ada
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const filePath = Path.join(imageDir, imageName);
        const fileStream = fs.createWriteStream(filePath);
        image.pipe(fileStream);

        fileStream.on('finish', () =>
          console.log('Profile image saved successfully')
        );
        fileStream.on('error', (err) =>
          console.error('Error saving profile image:', err)
        );

        profileImage = `/uploads/strukturOrganisasi/${imageName}`;
      }

      // Simpan ke database
      const struktur = await this._service.createStrukturOrganisasi(
        nama,
        jabatan,
        profileImage
      );
      return h.response(struktur).code(201);
    } catch (error) {
      console.error('Error in createStrukturOrganisasi:', error);
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(400);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async updateStrukturOrganisasi(request, h) {
    try {
      const { id } = request.params;
      const { nama, jabatan } = request.payload;

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      // 🔧 Perbaikan di sini: default null
      let profileImage = null;

      // ✅ Cek apakah user upload file baru
      if (request.payload.profileImage && request.payload.profileImage._data) {
        const image = request.payload.profileImage;
        const imageName = Date.now() + Path.extname(image.hapi.filename);
        const imageDir = './src/uploads/strukturOrganisasi/';

        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const filePath = Path.join(imageDir, imageName);
        const fileStream = fs.createWriteStream(filePath);
        image.pipe(fileStream);

        fileStream.on('finish', () =>
          console.log('Profile image updated successfully')
        );
        fileStream.on('error', (err) =>
          console.error('Error saving profile image:', err)
        );

        profileImage = `/uploads/strukturOrganisasi/${imageName}`;
      }

      // ✅ Kirim ke service (image bisa null, dan akan diabaikan kalau null)
      const updatedStruktur = await this._service.updateStrukturOrganisasi(
        id,
        nama,
        jabatan,
        profileImage
      );

      if (!updatedStruktur) {
        throw new NotFoundError('Struktur Organisasi not found');
      }

      return h.response(updatedStruktur).code(200);
    } catch (error) {
      if (
        error instanceof ClientError ||
        error instanceof ValidationError ||
        error instanceof NotFoundError
      ) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async deleteStrukturOrganisasi(request, h) {
    try {
      const { id } = request.params;

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      // Panggil service untuk menghapus struktur organisasi (dan gambarnya jika ada)
      const result = await this._service.deleteStrukturOrganisasi(id);

      return h.response(result).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(404);
      }
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }

  async uploadProfileImage(request, h) {
    try {
      const image = request.payload.image;
      if (!image) {
        throw new ClientError('No image uploaded');
      }

      const imageName = Date.now() + Path.extname(image.hapi.filename);
      const imageDir = './src/uploads/strukturOrganisasi/';
      const filePath = Path.join(imageDir, imageName);

      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        image.pipe(fileStream);
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });

      return h
        .response({ profileImage: `/uploads/strukturOrganisasi/${imageName}` })
        .code(200);
    } catch (error) {
      console.error('Error handling upload:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }
}

module.exports = StrukturOrganisasiHandler;
