const { pool } = require('../config/db');

const getAllJabatanPetugas = async () => {
  const res = await pool.query('SELECT * FROM jabatan_petugas ORDER BY id ASC'); // ✅ nama tabel sudah benar
  return res.rows;
};

const getJabatanPetugasById = async (id) => {
  const res = await pool.query('SELECT * FROM jabatan_petugas WHERE id = $1', [id]);
  return res.rows[0];
};

const createJabatanPetugas = async (data) => {
  const { nama_jabatan, uraian } = data;
  const res = await pool.query(
    'INSERT INTO jabatan_petugas (nama_jabatan, uraian) VALUES ($1, $2) RETURNING *',
    [nama_jabatan, uraian]
  );
  return res.rows[0];
};

const updateJabatanPetugas = async (id, data) => {
  const { nama_jabatan, uraian } = data;
  const res = await pool.query(
    'UPDATE jabatan_petugas SET nama_jabatan = $1, uraian = $2 WHERE id = $3 RETURNING *',
    [nama_jabatan, uraian, id]
  );
  return res.rows[0];
};

const deleteJabatanPetugas = async (id) => {
  const res = await pool.query('DELETE FROM jabatan_petugas WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  getAllJabatanPetugas,
  getJabatanPetugasById,
  createJabatanPetugas,
  updateJabatanPetugas,
  deleteJabatanPetugas
};
