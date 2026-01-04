const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

module.exports = router;

