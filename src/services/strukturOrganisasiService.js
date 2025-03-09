const { PrismaClient } = require('@prisma/client');
const NotFoundError = require('../exceptions/NotFoundError');
const ValidationError = require('../exceptions/ValidationError');

const prisma = new PrismaClient();

class StrukturOrganisasiService {
  // 🔹 Ambil semua data struktur organisasi
  async getAllStrukturOrganisasi() {
    try {
      const strukturOrganisasi = await prisma.strukturOrganisasi.findMany();
      if (!strukturOrganisasi || strukturOrganisasi.length === 0) {
        throw new NotFoundError('No struktur organisasi found');
      }
      return strukturOrganisasi;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Ambil data berdasarkan ID
  async getStrukturOrganisasiById(id) {
    try {
      const struktur = await prisma.strukturOrganisasi.findUnique({
        where: { id: parseInt(id) },
      });

      if (!struktur) {
        throw new NotFoundError('Struktur Organisasi not found');
      }

      return struktur;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Tambah data baru
  async createStrukturOrganisasi(nama, jabatan, profileImage) {
    try {
      if (!nama || !jabatan) {
        throw new ValidationError('Nama dan Jabatan wajib diisi');
      }

      const struktur = await prisma.strukturOrganisasi.create({
        data: {
          nama,
          jabatan,
          profileImage,
        },
      });

      return struktur;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Perbarui data berdasarkan ID
  async updateStrukturOrganisasi(id, nama, jabatan, profileImage) {
    try {
      const struktur = await prisma.strukturOrganisasi.update({
        where: { id: parseInt(id) },
        data: {
          nama,
          jabatan,
          profileImage,
        },
      });

      return struktur;
    } catch (error) {
      if (error.code === 'P2025') {
        // Kode error Prisma jika data tidak ditemukan
        throw new NotFoundError('Struktur Organisasi not found');
      }
      throw error;
    }
  }

  // 🔹 Hapus data berdasarkan ID
  async deleteStrukturOrganisasi(id) {
    try {
      const struktur = await prisma.strukturOrganisasi.delete({
        where: { id: parseInt(id) },
      });

      return struktur;
    } catch (error) {
      if (error.code === 'P2025') {
        // Kode error Prisma jika data tidak ditemukan
        throw new NotFoundError('Struktur Organisasi not found');
      }
      throw error;
    }
  }
}

module.exports = StrukturOrganisasiService;
