const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET tidak ditemukan di environment variables.");
    return res.sendStatus(500);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kadaluarsa" });
    }

    req.user = decoded;
    next();
  });
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang diizinkan" });
  }
  next();
};

const authorizeUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Hanya user yang diizinkan" });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeUser,
};
