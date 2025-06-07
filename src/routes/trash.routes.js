/**
 * Trash Routes
 */
const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trash.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Apply authentication middleware to all trash routes
router.use(isAuthenticated);

// GET /trash - Render trash view
router.get('/', trashController.getTrashView);

// POST /trash/:fileId/restore - Restore a file from trash
router.post('/:fileId/restore', trashController.restoreFile);

// DELETE /trash/:fileId - Permanently delete a file from trash
router.delete('/:fileId', trashController.deleteFilePermanently);

// DELETE /trash - Empty the trash
router.delete('/', trashController.emptyTrashBin);

module.exports = router;
