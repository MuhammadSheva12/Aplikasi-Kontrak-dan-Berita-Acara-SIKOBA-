const { pool } = require('../config/db');

const getAllPegawai = async () => {
  const res = await pool.query('SELECT * FROM data_pegawai ORDER BY id ASC');
  return res.rows;
};

const getPegawaiById = async (id) => {
  const res = await pool.query('SELECT * FROM data_pegawai WHERE id = $1', [id]);
  return res.rows[0];
};

const createPegawai = async ({ nama, nip, jabatan }) => {
  const res = await pool.query(
    'INSERT INTO data_pegawai (nama, nip, jabatan) VALUES ($1, $2, $3) RETURNING *',
    [nama, nip, jabatan]
  );
  return res.rows[0];
};

const updatePegawai = async (id, { nama, nip, jabatan }) => {
  const res = await pool.query(
    'UPDATE data_pegawai SET nama = $1, nip = $2, jabatan = $3 WHERE id = $4 RETURNING *',
    [nama, nip, jabatan, id]
  );
  return res.rows[0];
};

const deletePegawai = async (id) => {
  const res = await pool.query('DELETE FROM data_pegawai WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

const getPegawaiCount = async () => {
  const res = await pool.query('SELECT COUNT(*) AS jumlah FROM data_pegawai');
  return parseInt(res.rows[0].jumlah, 10);
};

module.exports = {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
  getPegawaiCount,
};