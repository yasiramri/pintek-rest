const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');
const ValidationError = require('../exceptions/ValidationError');

class NewsService {
  // Mengambil semua berita
  async getAllNews() {
    try {
      const news = await prisma.news.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          category: true,
        },
      });

      if (!news || news.length === 0) {
        throw new NotFoundError('No news found');
      }
      return news;
    } catch (error) {
      throw error;
    }
  }

  // Mengambil berita berdasarkan ID
  async getNewsById(id) {
    try {
      const news = await prisma.news.findUnique({
        where: {
          id: parseInt(id),
          isDeleted: false,
        },
        include: {
          author: true,
          category: true,
        },
      });

      if (!news) {
        throw new NotFoundError('News not found');
      }

      return news;
    } catch (error) {
      throw error;
    }
  }

  // Menambahkan berita baru
  async createNews(title, content, imagePath, userId, categoryId, isFeatured) {
    try {
      // Membuat berita baru dengan kategori dan tag
      const news = await prisma.news.create({
        data: {
          title,
          content,
          imagePath,
          authorId: userId,
          categoryId: parseInt(categoryId), // Menghubungkan dengan kategori
          isFeatured: isFeatured === 'true',
        },
        include: {
          category: true, // Termasuk tag dan kategori pada hasil
        },
      });

      return news;
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate berita berdasarkan ID
  async updateNews(id, title, content, imagePath, categoryId, isFeatured) {
    try {
      // Siapkan objek data untuk update
      const updateData = {
        title,
        content,
        categoryId: parseInt(categoryId),
        isFeatured,
      };

      // Hanya tambahkan imagePath jika tidak null (artinya user upload atau kirim path lama)
      if (typeof imagePath === 'string' && imagePath.trim() !== '') {
        updateData.imagePath = imagePath; // catatan: pakai 'imagePath' bukan 'image_path' karena Prisma case-sensitive terhadap schema
      }

      // Lakukan update ke database
      const news = await prisma.news.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          category: true,
        },
      });

      return news;
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma error code jika data tidak ditemukan
        throw new NotFoundError('News not found');
      }
      throw error;
    }
  }

  // Menghapus berita berdasarkan ID
  async deleteNews(id) {
    try {
      const news = await prisma.news.update({
        where: { id: parseInt(id) },
        data: {
          isDeleted: true,
        },
        include: {
          category: true,
        },
      });

      return news;
    } catch (error) {
      if (error.code === 'P2025') {
        // Kode error Prisma jika data tidak ditemukan
        throw new NotFoundError('News not found');
      }
      throw error;
    }
  }
}

module.exports = NewsService;
