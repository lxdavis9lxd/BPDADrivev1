/**
 * API Routes
 * Used for client-side AJAX requests
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const { searchFiles } = require('../services/filesystem.service');
const { formatDate, formatFileSize } = require('../utils/helpers');

// Apply authentication middleware to all API routes
router.use(isAuthenticated);

/**
 * Search files and folders
 */
router.get('/search', async (req, res) => {
    try {
        const { user } = req.session;
        const { query, type, tag } = req.query;
        
        // Build search parameters
        const searchParams = {};
        if (query) searchParams.query = query;
        if (type) searchParams.type = type;
        if (tag) searchParams.tag = tag;
        
        // Execute search
        const results = await searchFiles(user.username, user.token, searchParams);
        
        // Format results for display
        const formattedResults = results.map(item => ({
            ...item,
            formattedCreatedAt: formatDate(item.createdAt),
            formattedModifiedAt: formatDate(item.modifiedAt),
            formattedSize: formatFileSize(item.size || 0),
            isDirectory: item.type === 'directory',
            isFile: item.type === 'file',
            isSymlink: item.type === 'symlink',
            tags: item.tags || [] // Include tags in the results
        }));
        
        return res.status(200).json({
            success: true,
            results: formattedResults
        });
    } catch (error) {
        console.error('Search error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Search failed',
            results: []
        });
    }
});

module.exports = router;
