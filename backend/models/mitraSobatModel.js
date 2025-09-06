const { pool } = require('../config/db');

const getAllMitraSobat = async () => {
  const res = await pool.query('SELECT * FROM mitra_sobat ORDER BY id ASC');
  return res.rows;
};

const getMitraSobatById = async (id) => {
  const res = await pool.query('SELECT * FROM mitra_sobat WHERE id = $1', [id]);
  return res.rows[0];
};

const createMitraSobat = async ({ nomor_mitra, nama, nik, alamat  }) => {
  const res = await pool.query(
    'INSERT INTO mitra_sobat (nomor_mitra, nama, nik, alamat) VALUES ($1, $2, $3, $4) RETURNING *',
    [nomor_mitra, nama, nik, alamat]
  );
  return res.rows[0];
};

const updateMitraSobat = async (id, { nomor_mitra, nama, nik, alamat }) => {
  const res = await pool.query( 
    'UPDATE mitra_sobat SET nomor_mitra = $1, nama = $2, nik = $3, alamat = $4 WHERE id = $5 RETURNING *',
    [nomor_mitra, nama, nik, alamat, id]
  );
  return res.rows[0];
};

const deleteMitraSobat = async (id) => {
  const res = await pool.query('DELETE FROM mitra_sobat WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

const getMitraSobatCount = async () => {
  const res = await pool.query('SELECT COUNT(*) AS jumlah FROM mitra_sobat');
  return parseInt(res.rows[0].jumlah, 10);  
};

module.exports = {
  getAllMitraSobat,
  getMitraSobatById,
  createMitraSobat,
  updateMitraSobat,
  deleteMitraSobat,
  getMitraSobatCount,
};