/**
 * Authentication Routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// GET /auth - Render login/registration page
router.get('/', authController.getAuthPage);

// POST /auth/login - Handle user login
router.post('/login', authController.login);

// POST /auth/register - Handle user registration
router.post('/register', authController.register);

// GET /auth/logout - Handle user logout
router.get('/logout', authController.logout);

module.exports = router;
