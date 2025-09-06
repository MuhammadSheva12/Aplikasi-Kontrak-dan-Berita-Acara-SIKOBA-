const express = require('express');
const router = express.Router();
const dipaController = require('../controllers/dipaController');

router.get('/', dipaController.getDipa);
router.put('/:id', dipaController.updateDipa);   // ➜ tambahkan ini

module.exports = router;
