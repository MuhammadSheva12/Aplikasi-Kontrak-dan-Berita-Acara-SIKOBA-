const { pool } = require('../config/db');

const getAllSatuan = async () => {
  const res = await pool.query('SELECT * FROM data_satuan ORDER BY id ASC');
  return res.rows;
};

const getSatuanById = async (id) => {
  const res = await pool.query('SELECT * FROM data_satuan WHERE id = $1', [id]);
  return res.rows[0];
};

const createSatuan = async (data) => {
  const res = await pool.query(
    'INSERT INTO data_satuan (uraian, uraian_status) VALUES ($1, $2) RETURNING *',
    [data.uraian, data.uraian_status]
  );
  return res.rows[0];
};

const updateSatuan = async (id, data) => {
  const res = await pool.query(
    'UPDATE data_satuan SET uraian = $1, uraian_status = $2 WHERE id = $3 RETURNING *',
    [data.uraian, data.uraian_status, id]
  );
  return res.rows[0];
};

const deleteSatuan = async (id) => {
  const res = await pool.query('DELETE FROM data_satuan WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  getAllSatuan,
  getSatuanById,
  createSatuan,
  updateSatuan,
  deleteSatuan
};
