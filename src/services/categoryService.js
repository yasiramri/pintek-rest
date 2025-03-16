const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundError = require('../exceptions/NotFoundError');

class CategoryService {
  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          news: true,
        },
      });

      if (!categories || categories.length === 0) {
        throw new NotFoundError('No categories found');
      }
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          news: true,
        },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }
      return category;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name) {
    try {
      const category = await prisma.category.create({
        data: { name },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id, name) {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name },
      });

      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Category not found');
      }
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await prisma.category.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError('Category not found');
      }
      throw error;
    }
  }
}

module.exports = CategoryService;
