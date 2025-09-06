const { pool } = require('../config/db');

const getAllAktivitas = async () => {
  const res = await pool.query('SELECT * FROM data_aktivitas ORDER BY id ASC');
  return res.rows;
};

const getAktivitasById = async (id) => {
  const res = await pool.query('SELECT * FROM data_aktivitas WHERE id = $1', [id]);
  return res.rows[0];
};

const createAktivitas = async ({ nama_aktivitas }) => {
  const res = await pool.query('INSERT INTO data_aktivitas (nama_aktivitas) VALUES ($1) RETURNING *', [nama_aktivitas]);
  return res.rows[0];
};

const updateAktivitas = async (id, { nama_aktivitas }) => {
  const res = await pool.query('UPDATE data_aktivitas SET nama_aktivitas = $1 WHERE id = $2 RETURNING *', [nama_aktivitas, id]);
  return res.rows[0];
};

const deleteAktivitas = async (id) => {
  const res = await pool.query('DELETE FROM data_aktivitas WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  getAllAktivitas,
  getAktivitasById,
  createAktivitas,
  updateAktivitas,
  deleteAktivitas,
};
