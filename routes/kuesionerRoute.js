const express = require('express');
const router = express.Router();
const kuesionerController = require('../controllers/kuesionerController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
});

// Get all kuesioners
router.get('/', kuesionerController.getAllKuesioners);

router.get('/kue', kuesionerController.testGetkuesioner);

// Get a single kuesioner by ID
router.get('/:id', kuesionerController.getKuesionerById);
router.get('/details/:id', kuesionerController.getKuesionerDetail);

// Create a new kuesioner
router.post('/', authMiddleware, upload.single('image'), kuesionerController.createKuesioner);

// Update a kuesioner
router.put('/:id', kuesionerController.updateKuesioner);

// Delete a kuesioner
router.delete('/:id', kuesionerController.deleteKuesioner);

router.post('/:kuesionerId/answer', authMiddleware, kuesionerController.answerKuesioner);


module.exports = router;
