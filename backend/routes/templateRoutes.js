const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getTemplateBastList,
  createNewTemplateBast,
  editTemplateBast,
  removeTemplateBast,
  getTemplateKontrakList,
  createNewTemplateKontrak,
  editTemplateKontrak,
  removeTemplateKontrak,
  generateTemplateKontrak,
} = require("../controllers/templateController");

const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ---------- TEMPLATE BAST ----------
router.get("/bast", authenticate, authorizeAdmin, getTemplateBastList);
router.post("/bast", authenticate, authorizeAdmin, upload.single("file"), createNewTemplateBast);
router.put("/bast/:id", authenticate, authorizeAdmin, upload.single("file"), editTemplateBast);
router.delete("/bast/:id", authenticate, authorizeAdmin, removeTemplateBast);

// ---------- TEMPLATE KONTRAK ----------
router.get("/kontrak", authenticate, authorizeAdmin, getTemplateKontrakList);
router.post("/kontrak", authenticate, authorizeAdmin, upload.single("file"), createNewTemplateKontrak);
router.put("/kontrak/:id", authenticate, authorizeAdmin, upload.single("file"), editTemplateKontrak);
router.delete("/kontrak/:id", authenticate, authorizeAdmin, removeTemplateKontrak);

module.exports = router;
