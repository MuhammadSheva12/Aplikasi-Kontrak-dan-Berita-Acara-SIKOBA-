const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");

const surveiController = require("../controllers/surveiController");
const teknisController = require("../controllers/teknisController");
const jabatanController = require("../controllers/jabatan_petugasController");
const pegawaiController = require("../controllers/pegawaiController");
const templateController = require("../controllers/templateController");
const satuanController = require("../controllers/satuanController");

// Route public/user (harus login, tapi tidak perlu admin)
router.get("/survei", authenticate, surveiController.getSurveiList);
router.get("/teknis", authenticate, teknisController.getTeknisList);
router.get("/jabatan", authenticate, jabatanController.getJabatanPetugasList);
router.get("/pegawai", authenticate, pegawaiController.getPegawaiList);
router.get("/satuan", authenticate, satuanController.getSatuanList);

// Template
router.get("/template", authenticate, templateController.getTemplateKontrakList);   // Kontrak
router.get("/template-bast", authenticate, templateController.getTemplateBastList); // BAST

module.exports = router;
