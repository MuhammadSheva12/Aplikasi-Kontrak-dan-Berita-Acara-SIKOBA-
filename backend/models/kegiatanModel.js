const { pool } = require('../config/db'); // sambungkan ke koneksi database

// Ambil semua teknis
const getAllTeknis = async () => {
  const result = await pool.query('SELECT * FROM data_teknis ORDER BY id');
  return result.rows;
};

// Ambil semua aktivitas
const getAllAktivitas = async () => {
  const result = await pool.query('SELECT * FROM data_aktivitas ORDER BY id');
  return result.rows;
};

// Ambil semua survei
const getAllSurvei = async () => {
  const result = await pool.query('SELECT * FROM data_survei ORDER BY id');
  return result.rows;
};

// Ambil semua kegiatan dengan nama teknis, aktivitas, survei (JOIN)
const getAllKegiatan = async () => {
  const result = await pool.query(`
    SELECT k.id, t.nama_teknis, a.nama_aktivitas, s.nama_survei
    FROM data_kegiatan k
    JOIN data_teknis t ON k.teknis_id = t.id
    JOIN data_aktivitas a ON k.aktivitas_id = a.id
    JOIN data_survei s ON k.survei_id = s.id
    ORDER BY k.id
  `);
  return result.rows;
};

// Ambil kegiatan berdasarkan ID
const getKegiatanById = async (id) => {
  const result = await pool.query(`
    SELECT k.id, t.nama_teknis, a.nama_aktivitas, s.nama_survei
    FROM data_kegiatan k
    JOIN data_teknis t ON k.teknis_id = t.id
    JOIN data_aktivitas a ON k.aktivitas_id = a.id
    JOIN data_survei s ON k.survei_id = s.id
    WHERE k.id = $1
  `, [id]);
  return result.rows[0];
};

// Insert data kegiatan baru
const createKegiatan = async ({ teknis_id, aktivitas_id, survei_id }) => {
  const result = await pool.query(`
    INSERT INTO data_kegiatan (teknis_id, aktivitas_id, survei_id)
    VALUES ($1, $2, $3) RETURNING *
  `, [teknis_id, aktivitas_id, survei_id]);
  return result.rows[0];
};

// Update data kegiatan
const updateKegiatan = async (id, { teknis_id, aktivitas_id, survei_id }) => {
  const result = await pool.query(`
    UPDATE data_kegiatan
    SET teknis_id = $1, aktivitas_id = $2, survei_id = $3
    WHERE id = $4 RETURNING *
  `, [teknis_id, aktivitas_id, survei_id, id]);
  return result.rows[0];
};

// Delete data kegiatan
const deleteKegiatan = async (id) => {
  const result = await pool.query('DELETE FROM data_kegiatan WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllTeknis,
  getAllAktivitas,
  getAllSurvei,
  getAllKegiatan,
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
};
