const express = require('express');
const router = express.Router();
const {
  getSatuanList,
  getSatuan,
  createNewSatuan,
  updateSatuanById,
  deleteSatuanById
} = require('../controllers/satuanController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeAdmin, getSatuanList);
router.get('/:id', authenticate, authorizeAdmin, getSatuan);
router.post('/', authenticate, authorizeAdmin, createNewSatuan);
router.put('/:id', authenticate, authorizeAdmin, updateSatuanById);
router.delete('/:id', authenticate, authorizeAdmin, deleteSatuanById);

module.exports = router;
