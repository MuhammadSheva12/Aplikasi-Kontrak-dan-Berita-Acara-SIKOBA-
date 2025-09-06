const { pool } = require('../config/db');

const getAllDipa = async () => {
  const { rows } = await pool.query(
    'SELECT id, nomor_dipa, tanggal FROM dipa ORDER BY id DESC'
  );
  return rows;
};

const updateDipaById = async (id, nomor_dipa, tanggal) => {
  const query = `
    UPDATE dipa
    SET nomor_dipa = $1,
        tanggal    = $2
    WHERE id = $3
    RETURNING *
  `;
  const { rows } = await pool.query(query, [nomor_dipa, tanggal, id]);
  return rows[0];
};

module.exports = { getAllDipa, updateDipaById };
