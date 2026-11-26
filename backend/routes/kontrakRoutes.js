const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { getKontrakCountHandler } = require("../controllers/kontrakController");

const {
  saveKontrak,
  generateKontrak,
  downloadKontrak,
  getAllKontrak,
  deleteKontrak,
} = require("../controllers/kontrakController");

router.get("/", authenticate, getAllKontrak);
router.post("/save", authenticate, saveKontrak);
router.post("/generate", authenticate, generateKontrak);
router.get("/download/:fileName", authenticate, downloadKontrak);
router.delete("/:id", authenticate, deleteKontrak);
router.get("/count", authenticate, getKontrakCountHandler);

module.exports = router;