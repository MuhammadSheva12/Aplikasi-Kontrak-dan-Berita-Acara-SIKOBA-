const { pool } = require("../config/db");

// ============================
// Ambil data untuk isi kontrak
// ============================
const getKontrakData = async (idPegawai, idJabatan, idSurvei) => {
  const query = `
    SELECT 
      dp.nama, 
      dp.nip, 
      jp.nama_jabatan AS jabatan_lengkap,
      ds.nama_survei
    FROM data_pegawai dp
    JOIN jabatan_petugas jp ON jp.id = $2
    JOIN data_survei ds ON ds.id = $3
    WHERE dp.id = $1
  `;
  const result = await pool.query(query, [idPegawai, idJabatan, idSurvei]);
  return result.rows[0];
};

// ============================
// Insert kontrak (TANPA id_user)
// ============================
const insertKontrak = async ({
  judul_dokumen,
  teknis,
  jumlah,
  original_template,
  file_name,
  data_json,
}) => {
  const query = `
    INSERT INTO data_kontrak
      (judul_dokumen, tanggal_generate, teknis, jumlah, original_template, file_name, data_json)
    VALUES ($1, NOW(), $2, $3, $4, $5, $6)
  `;

  await pool.query(query, [
    judul_dokumen,
    teknis,
    jumlah,
    original_template,
    file_name,
    data_json,
  ]);
};

// ============================
// GET semua kontrak
// ============================
const getAllKontrak = async () => {
  const result = await pool.query(`
    SELECT *
    FROM data_kontrak
    ORDER BY tanggal_generate DESC
  `);
  return result.rows;
};

// ============================
// DELETE kontrak
// ============================
const deleteKontrakById = async (id) => {
  await pool.query("DELETE FROM data_kontrak WHERE id = $1", [id]);
};

const getKontrakCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS jumlah FROM data_kontrak");
  return parseInt(result.rows[0].jumlah, 10);
};

module.exports = {
  getKontrakData,
  insertKontrak,
  getAllKontrak,
  deleteKontrakById,
  getKontrakCount,
};
