const { pool } = require("../config/db");

const getAllTemplateKontrak = async () => {
  const res = await pool.query("SELECT * FROM template_kontrak ORDER BY id ASC");
  return res.rows;
};

const createTemplateKontrak = async ({ judul_template, pembuat, file_name, original_name }) => {
  const res = await pool.query(
    `INSERT INTO template_kontrak (judul_template, pembuat, file_name, original_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [judul_template, pembuat, file_name, original_name]
  );
  return res.rows[0];
};

const getTemplateKontrakById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM template_kontrak WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

const updateTemplateKontrak = async (id, { judul_template, pembuat, file_name, original_name }) => {
  const res = await pool.query(
    `UPDATE template_kontrak
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

const deleteTemplateKontrak = async (id) => {
  const res = await pool.query(
    "DELETE FROM template_kontrak WHERE id = $1 RETURNING *",
    [id]
  );
  return res.rows[0];
};

module.exports = {
  getAllTemplateKontrak,
  createTemplateKontrak,
  updateTemplateKontrak,
  deleteTemplateKontrak,
  getTemplateKontrakById,
};
