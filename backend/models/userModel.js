const { pool } = require("../config/db");

async function getAllUsers() {
  const query = `
    SELECT 
      u.id,
      u.username,
      u.role,
      u.password,
      p.nama AS nama_pegawai,
      t.nama_teknis,
      u.created_at,
      u.updated_at
    FROM data_user u
    JOIN data_pegawai p ON u.pegawai_id = p.id
    JOIN data_teknis t ON u.teknis_id = t.id
    ORDER BY u.id
  `;
  const { rows } = await pool.query(query);
  console.log("Model: getAllUsers - rows:", rows.length);
  return rows;
}

async function getUserById(id) {
  const query = `
    SELECT 
      u.id,
      u.username,
      u.role,
      u.password,
      p.nama AS nama_pegawai,
      t.nama_teknis,
      u.created_at,
      u.updated_at
    FROM data_user u
    JOIN data_pegawai p ON u.pegawai_id = p.id
    JOIN data_teknis t ON u.teknis_id = t.id
    WHERE u.id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [id]);
  console.log("Model: getUserById - id:", id, "- result:", rows[0]);
  return rows[0] || null;
}

async function getUserByUsername(username) {
  const query = `
    SELECT 
      u.id,
      u.username,
      u.role,
      u.password,
      p.nama AS nama_pegawai,
      t.nama_teknis,
      u.created_at,
      u.updated_at
    FROM data_user u
    JOIN data_pegawai p ON u.pegawai_id = p.id
    JOIN data_teknis t ON u.teknis_id = t.id
    WHERE u.username = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [username]);
  console.log("Model: getUserByUsername - username:", username, "- found:", !!rows[0]);
  return rows[0] || null;
}

async function createUser(userData) {
  const { pegawai_id, teknis_id, username, password, role } = userData;
  const query = `
    INSERT INTO data_user (pegawai_id, teknis_id, username, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    pegawai_id,
    teknis_id,
    username,
    password,
    role,
  ]);
  console.log("Model: createUser - created:", rows[0]);
  return rows[0];
}

async function updateUser(id, userData) {
  const { pegawai_id, teknis_id, username, password, role } = userData;
  const query = `
    UPDATE data_user
    SET pegawai_id = $1, teknis_id = $2, username = $3, password = $4, role = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    pegawai_id,
    teknis_id,
    username,
    password,
    role,
    id,
  ]);
  console.log("Model: updateUser - updated:", rows[0]);
  return rows[0] || null;
}

async function deleteUser(id) {
  const query = "DELETE FROM data_user WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  console.log("Model: deleteUser - deleted:", rows[0]);
  return rows[0] || null;
}

async function getAllTeknis() {
  const query = "SELECT * FROM data_teknis ORDER BY nama_teknis";
  const { rows } = await pool.query(query);
  console.log("Model: getAllTeknis - jumlah:", rows.length);
  return rows;
}

async function getAllPegawai() {
  const query = "SELECT * FROM data_pegawai ORDER BY nama";
  const { rows } = await pool.query(query);
  console.log("Model: getAllPegawai - jumlah:", rows.length);
  return rows;
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getAllTeknis,
  getAllPegawai,
};
