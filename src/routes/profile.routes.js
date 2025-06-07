/**
 * Profile Routes
 */
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Apply authentication middleware to all profile routes
router.use(isAuthenticated);

// GET /profile - Render profile page
router.get('/', profileController.getProfilePage);

// PUT /profile - Update user profile
router.put('/', profileController.updateProfile);

// PUT /profile/password - Change user password
router.put('/password', profileController.changePassword);

// PUT /profile/preferences - Update user preferences
router.put('/preferences', profileController.updatePreferences);

module.exports = router;
