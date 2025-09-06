const express = require('express');
const router = express.Router();
const {
  getTeknisList,
  getTeknis,
  createNewTeknis,
  updateTeknisById,
  deleteTeknisById
} = require('../controllers/teknisController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeAdmin, getTeknisList);         // Ambil semua teknis
router.post('/', authenticate, authorizeAdmin, createNewTeknis);      // Tambah teknis
router.get('/:id', authenticate, authorizeAdmin, getTeknis);          // Ambil teknis by ID
router.put('/:id', authenticate, authorizeAdmin, updateTeknisById);   // Update teknis
router.delete('/:id', authenticate, authorizeAdmin, deleteTeknisById);// Hapus teknis

module.exports = router;
