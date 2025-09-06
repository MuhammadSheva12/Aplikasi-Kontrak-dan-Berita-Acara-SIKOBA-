const express = require('express');
const router = express.Router();
const {
  getPegawaiList,
  getPegawai,
  createNewPegawai, 
  updatePegawaiById,
  deletePegawaiById,
  getPegawaiCountHandler
} = require('../controllers/pegawaiController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/count', authenticate, authorizeAdmin, getPegawaiCountHandler);
router.get('/', authenticate, authorizeAdmin, getPegawaiList);
router.get('/:id', authenticate, authorizeAdmin, getPegawai);
router.post('/', authenticate, authorizeAdmin, createNewPegawai);
router.put('/:id', authenticate, authorizeAdmin, updatePegawaiById);
router.delete('/:id', authenticate, authorizeAdmin, deletePegawaiById);

module.exports = router;
