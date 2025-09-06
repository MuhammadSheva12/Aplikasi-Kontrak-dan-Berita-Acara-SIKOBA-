const express = require('express');
const router = express.Router();
const {
  getSurveiList,
  getSurvei,
  createNewSurvei,
  updateSurveiById,
  deleteSurveiById
} = require('../controllers/surveiController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Semua rute hanya bisa diakses admin yang sudah login
router.get('/', authenticate, authorizeAdmin, getSurveiList);         // Ambil semua survei
router.post('/', authenticate, authorizeAdmin, createNewSurvei);      // Tambah survei
router.get('/:id', authenticate, authorizeAdmin, getSurvei);          // Ambil survei by ID
router.put('/:id', authenticate, authorizeAdmin, updateSurveiById);   // Update survei
router.delete('/:id', authenticate, authorizeAdmin, deleteSurveiById);// Hapus survei

module.exports = router;
