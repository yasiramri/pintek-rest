const Joi = require('joi');

const StrukturOrganisasiSchema = Joi.object({
  nama: Joi.string().required().messages({
    'string.empty': 'Nama tidak boleh kosong',
    'any.required': 'Nama wajib diisi',
  }),
  jabatan: Joi.string().required().messages({
    'string.empty': 'Jabatan tidak boleh kosong',
    'any.required': 'Jabatan wajib diisi',
  }),
  profileImage: Joi.any()
    .optional()
    .messages({
      'any.only': 'File yang diunggah tidak valid',
    }),
});

module.exports = { StrukturOrganisasiSchema };
