// src/app/backend/models/pejabatModel.js
const { pool } = require("../config/db"); // ✅ harus pakai destructuring


const getAllPejabat = async () => {
  const res = await pool.query('SELECT * FROM pejabat ORDER BY id DESC');
  return res.rows;
};

const updatePejabatById = async (id, nama_pejabat_pembuat_komitmen, nip) => {
  const query = `
    UPDATE pejabat
    SET nama_pejabat_pembuat_komitmen = $1, nip = $2
    WHERE id = $3 RETURNING *
  `;
  const { rows } = await pool.query(query, [nama_pejabat_pembuat_komitmen, nip, id]);
  return rows[0];
};

module.exports = {
  getAllPejabat,
  updatePejabatById,
};
