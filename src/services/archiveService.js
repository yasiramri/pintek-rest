const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');

class ArchiveService {
  // Mengambil semua artikel yang diarsipkan (soft delete)
  async getArchivedArticles() {
    try {
      const archivedArticles = await prisma.news.findMany({
        where: {
          isDeleted: true, // Hanya artikel yang dihapus dengan soft delete
        },
        include: {
          category: true,
        },
      });

      return archivedArticles;
    } catch (error) {
      throw error;
    }
  }

  // Mengembalikan artikel yang di-arsipkan (restore)
  async restoreArticle(id) {
    try {
      const restoredArticle = await prisma.news.update({
        where: { id: parseInt(id) },
        data: {
          isDeleted: false, // Mengubah status menjadi tidak dihapus
          deletedAt: null, // Menghapus informasi penghapusan
        },
        include: {
          category: true,
        },
      });

      return restoredArticle;
    } catch (error) {
      throw new NotFoundError('Article not found');
    }
  }

  // Menghapus artikel secara permanen (hard delete)
  async hardDeleteArticle(id) {
    try {
      const deletedArticle = await prisma.news.delete({
        where: { id: parseInt(id) },
        include: {
          category: true,
        },
      });

      return deletedArticle;
    } catch (error) {
      throw new NotFoundError('Article not found');
    }
  }
}

module.exports = ArchiveService;
