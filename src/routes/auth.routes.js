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

// GET /auth/forgot-password - Render forgot password page
router.get('/forgot-password', authController.getForgotPasswordPage);

// POST /auth/forgot-password - Handle forgot password request
router.post('/forgot-password', authController.forgotPassword);

// GET /auth/reset-password/:token - Render reset password page
router.get('/reset-password/:token', authController.getResetPasswordPage);

// POST /auth/reset-password/:token - Handle password reset
router.post('/reset-password/:token', authController.resetPasswordHandler);

module.exports = router;
