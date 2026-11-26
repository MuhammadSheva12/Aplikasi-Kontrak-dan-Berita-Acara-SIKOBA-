const { pool } = require("../config/db");

// ============================
// Ambil data untuk isi BAST
// ============================
const getBastData = async (idPegawai, idJabatan, idSurvei) => {
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
  const result = await pool.query(query, [
    idPegawai,
    idJabatan,
    idSurvei,
  ]);
  return result.rows[0];
};

// ============================
// Insert BAST
// ============================
const insertBast = async ({
  judul_dokumen,
  jumlah,
  original_template,
  file_name,
  data_json,
}) => {
  const query = `
    INSERT INTO data_bast
      (judul_dokumen, tanggal_generate, jumlah, original_template, file_name, data_json)
    VALUES ($1, NOW(), $2, $3, $4, $5)
  `;

  await pool.query(query, [
    judul_dokumen,
    jumlah,
    original_template,
    file_name,
    data_json,
  ]);
};

// ============================
// GET semua BAST
// ============================
const getAllBast = async () => {
  const result = await pool.query(`
    SELECT *
    FROM data_bast
    ORDER BY tanggal_generate DESC
  `);
  return result.rows;
};

// ============================
// DELETE BAST
// ============================
const deleteBastById = async (id) => {
  await pool.query("DELETE FROM data_bast WHERE id = $1", [id]);
};

const getBastCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS jumlah FROM data_bast");
  return parseInt(result.rows[0].jumlah, 10);
};

module.exports = {
  getBastData,
  insertBast,
  getAllBast,
  deleteBastById,
  getBastCount,
};
