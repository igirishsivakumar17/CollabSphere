const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const multer = require('multer');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

const router = express.Router();

// Route to fetch user profile
router.get('/profile', getUserProfile);

// Route to update user profile
router.post('/update-profile', upload.single('resume'), updateUserProfile);

module.exports = router;