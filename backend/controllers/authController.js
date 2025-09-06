const { getUserByUsername } = require("../models/userModel");
const { decrypt } = require("../utils/encrypt");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRES_IN = "1h";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    let decryptedPassword;
    try {
      decryptedPassword = decrypt(user.password);
    } catch (err) {
      console.error("Error dekripsi password:", err);
      return res.status(500).json({ message: "Error saat dekripsi password" });
    }

    if (password !== decryptedPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, //  1 hour
    });

    return res.json({
      message: "Login berhasil",
      username: user.username,
      role: user.role,
      nama_pegawai: user.nama_pegawai,
      nama_teknis: user.nama_teknis,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  return res.json({ message: "Logout berhasil" });
};

const checkAuth = async (req, res) => {
  try {
    const { username, role } = req.user;

    // Ambil data lengkap user dari database
    const user = await getUserByUsername(username, role);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({
      message: "Authenticated",
      data: {
        username: user.username,
        role: user.role,
        nama_pegawai: user.nama_pegawai,
        nama_teknis: user.nama_teknis,
      },
    });
  } catch (error) {
    console.error("CheckAuth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  checkAuth
};