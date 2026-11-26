const { pool } = require("../config/db");

const getAllTeknis = async () => {
  const res = await pool.query("SELECT * FROM data_teknis ORDER BY id ASC");
  return res.rows;
};

const getTeknisById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM data_teknis WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

const createTeknis = async ({ nama_teknis, kode_teknis }) => {
  const res = await pool.query(
    "INSERT INTO data_teknis (nama_teknis, kode_teknis) VALUES ($1, $2) RETURNING *",
    [nama_teknis, kode_teknis]
  );
  return res.rows[0];
};

const updateTeknis = async (id, { nama_teknis, kode_teknis }) => {
  const res = await pool.query(
    "UPDATE data_teknis SET nama_teknis=$1, kode_teknis=$2 WHERE id=$3 RETURNING *",
    [nama_teknis, kode_teknis, id]
  );
  return res.rows[0];
};

const deleteTeknis = async (id) => {
  const res = await pool.query(
    "DELETE FROM data_teknis WHERE id=$1 RETURNING *",
    [id]
  );
  return res.rows[0];
};

module.exports = {
  getAllTeknis,
  getTeknisById,
  createTeknis,
  updateTeknis,
  deleteTeknis,
};
