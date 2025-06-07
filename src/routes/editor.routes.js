/**
 * Editor Routes
 */
const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editor.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Apply authentication middleware to all editor routes
router.use(isAuthenticated);

// GET /editor/:fileId - Render editor view for a specific file
router.get('/:fileId', editorController.getEditorView);

// POST /editor/:fileId/save - Save file content
router.post('/:fileId/save', editorController.saveFile);

// POST /editor/preview - Get markdown preview
router.post('/preview', editorController.getMarkdownPreview);

// PUT /editor/:fileId/tags - Update file tags
router.put('/:fileId/tags', editorController.updateFileTags);

module.exports = router;
