const express = require('express');
const { registerUser, loginUser, getUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../utils/authUtils');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/user',protect, getAllUsers);
router.get('/user/:id',protect, getUser);
router.put('/update/:id',protect, updateUser);
router.delete('/delete/:id',protect, deleteUser);

module.exports = router;
