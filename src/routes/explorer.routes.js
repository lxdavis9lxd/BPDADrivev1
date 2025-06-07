/**
 * Explorer Routes
 */
const express = require('express');
const router = express.Router();
const explorerController = require('../controllers/explorer.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Apply authentication middleware to all explorer routes
router.use(isAuthenticated);

// GET /explorer - Render explorer view
router.get('/', explorerController.getExplorerView);

// POST /explorer/create - Create a new file or folder
router.post('/create', explorerController.createFileOrFolder);

// DELETE /explorer/:fileId - Delete a file or folder
router.delete('/:fileId', explorerController.deleteFileOrFolder);

// PUT /explorer/:fileId/rename - Rename a file or folder
router.put('/:fileId/rename', explorerController.renameFileOrFolder);

module.exports = router;
