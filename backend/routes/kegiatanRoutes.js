const express = require('express');
const router = express.Router();
const {
  getTeknisList,
  getAktivitasList,
  getSurveiList,
  getKegiatanList,
  getKegiatan,
  createNewKegiatan,
  updateKegiatanById,
  deleteKegiatanById,
} = require('../controllers/kegiatanController');

const {
  authenticate,
  authorizeAdmin,
} = require('../middleware/authMiddleware');

// Semua rute kegiatan hanya bisa diakses admin yang sudah login
router.get('/', authenticate, authorizeAdmin, getKegiatanList);              // Ambil semua kegiatan
router.post('/', authenticate, authorizeAdmin, createNewKegiatan);           // Tambah kegiatan
router.put('/:id', authenticate, authorizeAdmin, updateKegiatanById);        // Edit kegiatan
router.delete('/:id', authenticate, authorizeAdmin, deleteKegiatanById);     // Hapus kegiatan
router.get('/:id', authenticate, authorizeAdmin, getKegiatan);               // Ambil 1 kegiatan berdasarkan ID

// Rute untuk ambil dropdown teknis, aktivitas, survei, bisa diakses semua user yang login
router.get('/teknis', authenticate, getTeknisList);
router.get('/aktivitas', authenticate, getAktivitasList);
router.get('/survei', authenticate, getSurveiList);

module.exports = router;
