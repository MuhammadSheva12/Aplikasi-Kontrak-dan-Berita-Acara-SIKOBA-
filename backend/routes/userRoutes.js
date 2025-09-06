const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createNewUser,
  updateUserById,
  deleteUserById,
  getUserProfile,
  decryptPassword,
  getTeknisList,
  getPegawaiList,
} = require('../controllers/userController');
const {
  authenticate,
  authorizeAdmin,
} = require('../middleware/authMiddleware');

// Route CRUD user → khusus admin
router.get('/', authenticate, authorizeAdmin, getUsers);
router.post('/', authenticate, authorizeAdmin, createNewUser);
router.put('/:id', authenticate, authorizeAdmin, updateUserById);
router.delete('/:id', authenticate, authorizeAdmin, deleteUserById);

// ✅ PROFILE → Semua yang login bisa akses profilnya
router.get('/profile', authenticate, getUserProfile);

// Dropdown teknis dan pegawai → semua yang login bisa akses
router.get('/teknis', authenticate, getTeknisList);
router.get('/pegawai', authenticate, getPegawaiList);

// Decrypt password → khusus admin
router.get('/:id/decrypt-password', authenticate, authorizeAdmin, decryptPassword);
router.get('/:id', authenticate, authorizeAdmin, getUser);

module.exports = router;
