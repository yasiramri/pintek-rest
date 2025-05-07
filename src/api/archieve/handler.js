const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class ArchiveHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getArchivedArticlesHandler =
      this.getArchivedArticlesHandler.bind(this);
    this.restoreArticleHandler = this.restoreArticleHandler.bind(this);
    this.hardDeleteArticleHandler = this.hardDeleteArticleHandler.bind(this);
  }

  // Mengambil artikel yang di-arsipkan (soft delete)
  async getArchivedArticlesHandler(request, h) {
    try {
      const archivedArticles = await this._service.getArchivedArticles();

      return h
        .response({
          status: 'success',
          data: { archivedArticles },
        })
        .code(200);
    } catch (error) {
      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  // Mengembalikan artikel yang di-arsipkan (restore)
  async restoreArticleHandler(request, h) {
    try {
      const { id } = request.params;
      const restoredArticle = await this._service.restoreArticle(id);

      return h
        .response({
          status: 'success',
          message: 'Article berhasil dipulihkan',
          data: { restoredArticle },
        })
        .code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(404);
      }

      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  // Menghapus artikel secara permanen (hard delete)
  async hardDeleteArticleHandler(request, h) {
    try {
      const { id } = request.params;
      const deletedArticle = await this._service.hardDeleteArticle(id);

      return h
        .response({
          status: 'success',
          message: 'Article berhasil dihapus secara permanen',
          data: { deletedArticle },
        })
        .code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(404);
      }

      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }
}

module.exports = ArchiveHandler;
