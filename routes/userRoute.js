const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const kuesionerController = require('../controllers/kuesionerController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });



// create user
router.post('/register', userController.createUser);
// login user
router.post('/login', userController.login);
//check all user that registered
router.get('/', userController.findAllUsers);

//protected route
//check user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Update user
router.put('/update', authMiddleware, userController.updateUser);

// Delete user
router.delete('/delete', authMiddleware, userController.deleteUser);

// Logout user
router.post('/logout', authMiddleware, userController.logout);


//uopdate profile
router.post('/profile/picture', authMiddleware, upload.single('profilePicture'), userController.updateProfilePicture);

// menampilkan  history kuesioner yang telah disi  user
router.get('/profile/history', authMiddleware, userController.showKuesionerHistory);

// menampilkan  history jawaban user
router.get('/kuesioner/:kuesionerId/answers', authMiddleware, kuesionerController.showUserAnswers);

// menampilkan  history kuesioner user
router.get('/profile/kuesioner', authMiddleware, userController.showUserOwnKuesioner);




module.exports = router;
