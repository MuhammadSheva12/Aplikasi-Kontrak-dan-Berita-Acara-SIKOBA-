const express = require("express");
const { loginUser, logoutUser, checkAuth  } = require("../controllers/authController");
const { authenticate,  } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);             // Login tidak perlu authenticate
router.post("/logout", authenticate, logoutUser); // Logout butuh authenticate karena hanya user login yang bisa logout

router.get("/check", authenticate, checkAuth);

module.exports = router;
