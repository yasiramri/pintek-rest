const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ValidationError = require('../../exceptions/ValidationError');
const {
  validateCreateNews,
  validateUpdateNews,
} = require('../../validators/news');
const fs = require('fs');
const Path = require('path');
const Boom = require('@hapi/boom');

class NewsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getAllNews(request, h) {
    try {
      const news = await this._service.getAllNews();
      return h.response(news).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async getNewsById(request, h) {
    try {
      const { id } = request.params;
      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const news = await this._service.getNewsById(id);
      if (!news) {
        throw new NotFoundError('News not found');
      }
      return h.response(news).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async createNews(request, h) {
    try {
      // Validasi input sebelum diproses
      const { error } = validateCreateNews(request.payload);
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      const { id: userId } = request.auth.credentials;
      console.log('User ID from token:', userId);

      const { title, content, categoryId, isFeatured } = request.payload;
      let imagePath = null;

      // Menangani file upload
      if (request.payload.image) {
        const image = request.payload.image;
        const imageName = Date.now() + Path.extname(image.hapi.filename);
        const imageDir = './src/uploads/newsImages/';

        // Pastikan direktori ada
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const filePath = Path.join(imageDir, imageName);
        const fileStream = fs.createWriteStream(filePath);
        image.pipe(fileStream);

        fileStream.on('finish', () => console.log('Image saved successfully'));
        fileStream.on('error', (err) =>
          console.error('Error saving image:', err)
        );

        imagePath = `/uploads/newsImages/${imageName}`;
      }

      const news = await this._service.createNews(
        title,
        content,
        imagePath,
        userId,
        categoryId,
        isFeatured
      );
      return h.response(news).code(201);
    } catch (error) {
      console.error('Error in createNews:', error);
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async updateNews(request, h) {
    try {
      const { id } = request.params;
      let { title, content, categoryId, isFeatured } = request.payload;
      isFeatured = isFeatured === 'true';
      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      // Validasi input (selain gambar)
      const { error } = validateUpdateNews({ title, content });
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      // Menangani upload file gambar jika ada
      let imagePath = null;

      if (request.payload.image) {
        const image = request.payload.image;
        const imageName = Date.now() + Path.extname(image.hapi.filename);
        const imageDir = './src/uploads/newsImages/';

        // Pastikan direktori ada
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const filePath = Path.join(imageDir, imageName);

        // Tunggu sampai file selesai di-upload sebelum lanjut
        await new Promise((resolve, reject) => {
          const fileStream = fs.createWriteStream(filePath);
          image.pipe(fileStream);
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });

        imagePath = `/uploads/newsImages/${imageName}`;
      }

      // Panggil service untuk update berita
      const updatedNews = await this._service.updateNews(
        id,
        title,
        content,
        imagePath, // bisa null kalau tidak ada file baru
        categoryId,
        isFeatured
      );

      if (!updatedNews) {
        throw new NotFoundError('News not found');
      }

      return h.response(updatedNews).code(200);
    } catch (error) {
      if (
        error instanceof ClientError ||
        error instanceof ValidationError ||
        error instanceof NotFoundError
      ) {
        return h.response({ message: error.message }).code(error.statusCode);
      }

      console.error('Error in updateNews:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }

  async deleteNews(request, h) {
    try {
      const { id } = request.params;

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      // Panggil service untuk menghapus berita (dan gambarnya jika ada)
      const result = await this._service.deleteNews(id);

      return h.response(result).code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(404);
      }
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }

  async uploadImage(request, h) {
    try {
      const image = request.payload.image;
      if (!image) {
        throw new ClientError('No image uploaded');
      }

      const imageName = Date.now() + Path.extname(image.hapi.filename);
      const imageDir = './src/uploads/newsImages/';
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
        .response({ imagePath: `/uploads/newsImages/${imageName}` })
        .code(200);
    } catch (error) {
      console.error('Error handling upload:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }
}

module.exports = NewsHandler;
