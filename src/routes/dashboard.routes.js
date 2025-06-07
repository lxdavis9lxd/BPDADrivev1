/**
 * Dashboard Routes
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Apply authentication middleware to all dashboard routes
router.use(isAuthenticated);

// GET /dashboard - Render dashboard view
router.get('/', dashboardController.getDashboardView);

// PUT /dashboard/email - Update user email
router.put('/email', dashboardController.updateEmail);

// PUT /dashboard/password - Update user password
router.put('/password', dashboardController.updatePassword);

// DELETE /dashboard/account - Delete user account
router.delete('/account', dashboardController.deleteAccount);

module.exports = router;
