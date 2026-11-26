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

    const decryptedPassword = decrypt(user.password);
    if (password !== decryptedPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // 🔑 JWT HARUS MENYIMPAN id_user
    const accessToken = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,       // localhost
      sameSite: "lax",     // 🔥 WAJIB
      maxAge: 60 * 60 * 1000,
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
  res.clearCookie("accessToken", {
    sameSite: "lax",
    secure: false,
  });
  return res.json({ message: "Logout berhasil" });
};

const checkAuth = async (req, res) => {
  return res.json({
    message: "Authenticated",
    user: req.user,
  });
};

module.exports = {
  loginUser,
  logoutUser,
  checkAuth,
};
