const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getAllTeknis,
  getAllPegawai,
} = require("../models/userModel");
const { encrypt, decrypt } = require("../utils/encrypt");

// Ambil semua user
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log("GET /users - Total users:", users.length);
    res.json(users);
  } catch (err) {
    console.error("GET /users - Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Ambil user berdasarkan ID
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      console.warn(`GET /users/${id} - User tidak ditemukan`);
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    console.log(`GET /users/${id} - User ditemukan:`, user);
    res.json(user);
  } catch (err) {
    console.error(`GET /users/${id} - Error:`, err);
    res.status(500).json({ message: err.message });
  }
};

// Tambah user baru
const createNewUser = async (req, res) => {
  try {
    const { pegawai_id, teknis_id, username, password, role } = req.body;
    console.log("POST /users - Request body:", req.body);

    if (!pegawai_id || !teknis_id || !username || !password || !role) {
      console.warn("POST /users - Data tidak lengkap");
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      console.warn("POST /users - Username sudah digunakan:", username);
      return res.status(409).json({ message: "Username sudah digunakan" });
    }

    const encryptedPassword = encrypt(password);
    const newUser = await createUser({
      pegawai_id,
      teknis_id,
      username,
      password: encryptedPassword,
      role,
    });

    console.log("POST /users - User berhasil dibuat:", newUser);
    res.status(201).json({ message: "User berhasil ditambahkan" });
  } catch (err) {
    console.error("POST /users - Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Edit user
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { pegawai_id, teknis_id, username, password, role } = req.body;

  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      console.warn(`PUT /users/${id} - User tidak ditemukan`);
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    let encryptedPassword = existingUser.password;
    if (password) {
      encryptedPassword = encrypt(password);
      console.log("PUT /users - Password dienkripsi ulang");
    }

    const updatedUser = await updateUser(id, {
      pegawai_id,
      teknis_id,
      username,
      password: encryptedPassword,
      role,
    });

    console.log(`PUT /users/${id} - User berhasil diperbarui`, updatedUser);
    res.json({ message: "User berhasil diperbarui" });
  } catch (err) {
    console.error(`PUT /users/${id} - Error:`, err);
    res.status(500).json({ message: err.message });
  }
};

// Hapus user
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      console.warn(`DELETE /users/${id} - User tidak ditemukan`);
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await deleteUser(id);
    console.log(`DELETE /users/${id} - User berhasil dihapus`);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error(`DELETE /users/${id} - Error:`, err);
    res.status(500).json({ message: err.message });
  }
};

// Ambil profil user dari token
const getUserProfile = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await getUserByUsername(username);
    if (!user) {
      console.warn("GET /profile - User tidak ditemukan");
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    console.log("GET /profile - User ditemukan:", user);
    res.json(user);
  } catch (err) {
    console.error("GET /profile - Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Decrypt password
const decryptPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
      console.warn(`GET /users/decrypt/${userId} - User tidak ditemukan`);
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const decryptedPassword = decrypt(user.password);
    console.log(`GET /users/decrypt/${userId} - Password berhasil didekripsi`);
    res.json({ decryptedPassword });
  } catch (err) {
    console.error("Error decryptPassword:", err);
    res.status(500).json({ message: "Gagal decrypt password" });
  }
};

// GET teknis
const getTeknisList = async (req, res) => {
  try {
    const teknis = await getAllTeknis();
    console.log("GET /teknis - Total:", teknis.length);
    res.json(teknis);
  } catch (err) {
    console.error("GET /teknis - Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET pegawai
const getPegawaiList = async (req, res) => {
  try {
    const pegawai = await getAllPegawai();
    console.log("GET /pegawai - Total:", pegawai.length);
    res.json(pegawai);
  } catch (err) {
    console.error("GET /pegawai - Error:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createNewUser,
  updateUserById,
  deleteUserById,
  getUserProfile,
  decryptPassword,
  getTeknisList,
  getPegawaiList,
};
