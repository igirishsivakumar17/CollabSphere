// filepath: /Users/girish/Desktop/development/CollabSphere/server/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser); // Ensure registerUser is a function
router.post('/login', loginUser); // Ensure loginUser is a function

module.exports = router;