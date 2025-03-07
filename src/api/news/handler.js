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

  // Handle POST request to create a new news item
  async createNews(request, h) {
    try {
      // Validasi data dengan Joi
      const { error } = validateCreateNews(request.payload);
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      const { title, content } = request.payload;
      let imagePath = null;

      // Menangani file upload
      if (request.payload.image) {
        const image = request.payload.image; // Ambil file gambar dari form data
        const imageName = Date.now() + Path.extname(image.hapi.filename); // Membuat nama unik untuk gambar
        const imageDir = './src/uploads/newsImages/';

        // Pastikan direktori ada
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        // Simpan gambar ke disk
        const filePath = Path.join(imageDir, imageName);
        const fileStream = fs.createWriteStream(filePath);
        image.pipe(fileStream);

        // Setelah gambar disimpan, simpan path ke database
        imagePath = `/uploads/newsImages/${imageName}`;
      }

      // Simpan berita ke database
      const news = await this._service.createNews(title, content, imagePath);
      return h.response(news).code(201);
    } catch (error) {
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      if (Boom.isBoom(error)) {
        return h
          .response({ message: error.output.payload.message })
          .code(error.output.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async updateNews(request, h) {
    try {
      const { id } = request.params;
      const { title, content, imagePath } = request.payload;

      // Validasi data dengan Joi untuk update
      const { error } = validateUpdateNews(request.payload);
      if (error) {
        throw new ValidationError(
          error.details.map((detail) => detail.message).join(', ')
        );
      }

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const updatedNews = await this._service.updateNews(
        id,
        title,
        content,
        imagePath
      );
      if (!updatedNews) {
        throw new NotFoundError('News not found');
      }
      return h.response(updatedNews).code(200);
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      if (error instanceof NotFoundError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      if (error instanceof ValidationError) {
        return h.response({ message: error.message }).code(error.statusCode);
      }
      return h.response({ message: error.message }).code(500);
    }
  }

  async deleteNews(request, h) {
    try {
      const { id } = request.params;

      if (!id) {
        throw new ClientError('ID parameter is required');
      }

      const deletedNews = await this._service.deleteNews(id);
      if (!deletedNews) {
        throw new NotFoundError('News not found');
      }
      return h.response({ message: 'News deleted successfully' }).code(200);
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

  async uploadImage(request, h) {
    try {
      // Ambil file gambar dari form data
      const image = request.payload.image;
      if (!image) {
        throw new ClientError('No image uploaded');
      }

      // Membuat nama unik untuk gambar
      const imageName = Date.now() + Path.extname(image.hapi.filename);
      const imageDir = './src/uploads/newsImages/';

      // Pastikan direktori tempat menyimpan gambar sudah ada
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      // Simpan gambar ke disk
      const filePath = Path.join(imageDir, imageName);
      const fileStream = fs.createWriteStream(filePath);
      image.pipe(fileStream); // Pipe file ke file stream untuk disimpan

      const imagePath = `/uploads/newsImages/${imageName}`; // Path relatif gambar

      return h.response({ imagePath }).code(200); // Mengembalikan path gambar yang sudah di-upload
    } catch (error) {
      console.error('Error handling upload:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }
}

module.exports = NewsHandler;
