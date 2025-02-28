// services/newsService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllNews = async (request, h) => {
  try {
    const news = await prisma.news.findMany({
      include: {
        author: true, // Menyertakan informasi author (User)
      },
    });
    return news;
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

const getNewsById = async (request, h) => {
  const { id } = request.params;
  try {
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
      include: { author: true }, // Menyertakan informasi author
    });

    if (!news) {
      return h.response('Not Found').code(404);
    }

    return news;
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

const createNews = async (request, h) => {
  const { title, content, authorId } = request.payload;
  try {
    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    return h.response(newNews).code(201); // Kode status 201 menunjukkan berita baru berhasil dibuat
  } catch (err) {
    console.error(err);
    return h.response('Internal Server Error').code(500);
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
};
