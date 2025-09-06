const { pool } = require('../config/db');

const getAllMitraLainnya = async () => {
  const res = await pool.query('SELECT * FROM mitra_lainnya ORDER BY id ASC');
  return res.rows;
};

const getMitraLainnyaById = async (id) => {
  const res = await pool.query('SELECT * FROM mitra_lainnya WHERE id = $1', [id]);
  return res.rows[0];
};

const createMitraLainnya = async ({ nama, nik, alamat, pekerjaan }) => {
  const res = await pool.query(
    `INSERT INTO mitra_lainnya (nama, nik, alamat, pekerjaan, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
    [nama, nik, alamat, pekerjaan]
  );
  return res.rows[0];
};

const updateMitraLainnya = async (id, { nama, nik, alamat, pekerjaan }) => {
  const res = await pool.query(
    `UPDATE mitra_lainnya SET nama = $1, nik = $2, alamat = $3, pekerjaan = $4, updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [nama, nik, alamat, pekerjaan, id]
  );
  return res.rows[0];
};

const deleteMitraLainnya = async (id) => {
  const res = await pool.query('DELETE FROM mitra_lainnya WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  getAllMitraLainnya,
  getMitraLainnyaById,
  createMitraLainnya,
  updateMitraLainnya,
  deleteMitraLainnya,
};
