const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

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



module.exports = router;
