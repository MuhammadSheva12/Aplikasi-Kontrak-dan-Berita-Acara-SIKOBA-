const express = require('express');
const router = express.Router();
const {
  getAktivitasList,
  getAktivitas,
  createNewAktivitas,
  updateAktivitasById,
  deleteAktivitasById
} = require('../controllers/aktivitasController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Semua rute hanya bisa diakses admin yang sudah login
router.get('/', authenticate, authorizeAdmin, getAktivitasList);         // Ambil semua aktivitas
router.post('/', authenticate, authorizeAdmin, createNewAktivitas);      // Tambah aktivitas
router.get('/:id', authenticate, authorizeAdmin, getAktivitas);          // Ambil aktivitas by ID
router.put('/:id', authenticate, authorizeAdmin, updateAktivitasById);   // Update aktivitas
router.delete('/:id', authenticate, authorizeAdmin, deleteAktivitasById);// Hapus aktivitas

module.exports = router;
