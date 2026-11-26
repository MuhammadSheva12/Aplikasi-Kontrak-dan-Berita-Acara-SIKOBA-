const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { getBastCountHandler } = require("../controllers/bastController");

const {
  saveBast,
  generateBast,
  downloadBast,
  getAllBast,
  deleteBast,
} = require("../controllers/bastController");

router.get("/", authenticate, getAllBast);
router.post("/save", authenticate, saveBast);
router.post("/generate", authenticate, generateBast);
router.get("/download/:fileName", authenticate, downloadBast);
router.delete("/:id", authenticate, deleteBast);
router.get("/count", authenticate, getBastCountHandler);

module.exports = router;
