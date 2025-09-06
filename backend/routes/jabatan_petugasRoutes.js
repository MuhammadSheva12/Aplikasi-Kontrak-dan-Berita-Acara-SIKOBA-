const express = require('express');
const router = express.Router();    
const {
    getJabatanPetugasList,
    getJabatanPetugas,
    createNewJabatanPetugas,
    updateJabatanPetugasById,
    deleteJabatanPetugasById
} = require('../controllers/jabatan_petugasController');

const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeAdmin, getJabatanPetugasList);
router.get('/:id', authenticate, authorizeAdmin, getJabatanPetugas);
router.post('/', authenticate, authorizeAdmin, createNewJabatanPetugas);
router.put('/:id', authenticate, authorizeAdmin, updateJabatanPetugasById);
router.delete('/:id', authenticate, authorizeAdmin, deleteJabatanPetugasById);

module.exports = router;
