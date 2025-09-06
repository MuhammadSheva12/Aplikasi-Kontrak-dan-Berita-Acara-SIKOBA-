const { pool } = require('../config/db');

const getAllSurvei = async () => {
  const res = await pool.query('SELECT * FROM data_survei ORDER BY id ASC');
  return res.rows;
};

const getSurveiById = async (id) => {
  const res = await pool.query('SELECT * FROM data_survei WHERE id = $1', [id]);
  return res.rows[0];
};

const createSurvei = async ({ nama_survei }) => {
  const res = await pool.query('INSERT INTO data_survei (nama_survei) VALUES ($1) RETURNING *', [nama_survei]);
  return res.rows[0];
};

const updateSurvei = async (id, { nama_survei }) => {
  const res = await pool.query('UPDATE data_survei SET nama_survei = $1 WHERE id = $2 RETURNING *', [nama_survei, id]);
  return res.rows[0];
};

const deleteSurvei = async (id) => {
  await pool.query('DELETE FROM data_survei WHERE id = $1 RETURNING *', [id]);
};

module.exports = {
  getAllSurvei,
  getSurveiById,
  createSurvei,
  updateSurvei,
  deleteSurvei,
};
