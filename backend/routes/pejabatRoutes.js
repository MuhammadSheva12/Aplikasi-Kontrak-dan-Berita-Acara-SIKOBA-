// src/app/backend/routes/pejabatRoutes.js
const express = require('express');
const router = express.Router();
const pejabatController = require('../controllers/pejabatController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', pejabatController.getPejabat);
router.put('/:id', pejabatController.updatePejabat); // Tambahkan endpoint edit

module.exports = router;
    