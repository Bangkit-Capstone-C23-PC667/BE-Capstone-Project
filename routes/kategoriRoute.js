const express = require('express');
const kategoriController = require('../controllers/kategoriController');

const router = express.Router();

// GET /kategoris
router.get('/', kategoriController.getAllKategoris);

// GET /kategoris/:id
router.get('/:id', kategoriController.getKategoriById);

// POST /kategoris
router.post('/', kategoriController.createKategori);

// PUT /kategoris/:id
router.put('/:id', kategoriController.updateKategori);

// DELETE /kategoris/:id
router.delete('/:id', kategoriController.deleteKategori);

module.exports = router;
