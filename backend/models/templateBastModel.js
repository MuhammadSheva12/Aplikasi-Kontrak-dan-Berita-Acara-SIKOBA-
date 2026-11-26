const { pool } = require("../config/db");

// ============================
// GET semua template BAST
// ============================
const getAllTemplateBast = async () => {
  const res = await pool.query(
    "SELECT * FROM template_bast ORDER BY id ASC"
  );
  return res.rows;
};

// ============================
// CREATE template BAST
// ============================
const createTemplateBast = async ({
  judul_template,
  pembuat,
  file_name,
  original_name,
}) => {
  const res = await pool.query(
    `INSERT INTO template_bast
      (judul_template, pembuat, file_name, original_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [judul_template, pembuat, file_name, original_name]
  );
  return res.rows[0];
};

// ============================
// ✅ GET template BAST by ID (INI YANG WAJIB ADA)
// ============================
const getTemplateBastById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM template_bast WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

// ============================
// UPDATE template BAST
// ============================
const updateTemplateBast = async (
  id,
  { judul_template, pembuat, file_name, original_name }
) => {
  const res = await pool.query(
    `UPDATE template_bast
     SET judul_template = $1,
         pembuat = $2,
         file_name = COALESCE($3, file_name),
         original_name = COALESCE($4, original_name),
         tanggal_update = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [judul_template, pembuat, file_name, original_name, id]
  );
  return res.rows[0];
};

// ============================
// DELETE template BAST
// ============================
const deleteTemplateBast = async (id) => {
  const res = await pool.query(
    "DELETE FROM template_bast WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
};

module.exports = {
  getAllTemplateBast,
  createTemplateBast,
  getTemplateBastById, // ✅ PENTING
  updateTemplateBast,
  deleteTemplateBast,
};
