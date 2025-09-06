const express = require('express');
const router = express.Router();
const {
  getMitraSobatList,
  getMitraSobat,
  createNewMitraSobat,
  updateMitraSobatById,
  deleteMitraSobatById,
  getMitraSobatCountHandler,
  getMitraLainnyaList,
  getMitraLainnya,
  createNewMitraLainnya,
  updateMitraLainnyaById,
  deleteMitraLainnyaById
} = require('../controllers/mitraController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// MITRA SOBAT
router.get('/count', authenticate, authorizeAdmin, getMitraSobatCountHandler);
router.get('/sobat', authenticate, authorizeAdmin, getMitraSobatList);
router.get('/sobat/:id', authenticate, authorizeAdmin, getMitraSobat);
router.post('/sobat', authenticate, authorizeAdmin, createNewMitraSobat);
router.put('/sobat/:id', authenticate, authorizeAdmin, updateMitraSobatById);
router.delete('/sobat/:id', authenticate, authorizeAdmin, deleteMitraSobatById);

// MITRA LAINNYA
router.get('/lainnya', authenticate, authorizeAdmin, getMitraLainnyaList);
router.get('/lainnya/:id', authenticate, authorizeAdmin, getMitraLainnya);
router.post('/lainnya', authenticate, authorizeAdmin, createNewMitraLainnya);
router.put('/lainnya/:id', authenticate, authorizeAdmin, updateMitraLainnyaById);
router.delete('/lainnya/:id', authenticate, authorizeAdmin, deleteMitraLainnyaById);

module.exports = router;
