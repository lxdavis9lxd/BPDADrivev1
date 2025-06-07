/**
 * Sharing Routes
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const { shareFile, getShareInfo, removeShare } = require('../services/sharing.service');
const { getFileById } = require('../services/filesystem.service');

// Apply authentication middleware to all sharing routes
router.use(isAuthenticated);

/**
 * GET /share/:fileId - Get sharing information for a file
 */
router.get('/:fileId', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Get file details
        const fileData = await getFileById(fileId, user.token);
        
        // Get sharing information
        const shareData = await getShareInfo(fileId, user.token);
        
        return res.render('sharing', {
            title: `BDPADrive - Sharing - ${fileData.name}`,
            user: user.username,
            file: fileData,
            shareData,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Get sharing info error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to get sharing information'
        });
    }
});

/**
 * POST /share/:fileId - Share a file with another user
 */
router.post('/:fileId', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        const { username, permission } = req.body;
        
        if (!fileId || !username) {
            return res.status(400).json({
                success: false,
                message: 'File ID and username are required'
            });
        }
        
        // Share the file
        await shareFile(fileId, username, permission || 'read', user.token);
        
        return res.status(200).json({
            success: true,
            message: `File shared with ${username} successfully`
        });
    } catch (error) {
        console.error('Share file error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to share file'
        });
    }
});

/**
 * DELETE /share/:fileId/:username - Remove file sharing for a user
 */
router.delete('/:fileId/:username', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId, username } = req.params;
        
        if (!fileId || !username) {
            return res.status(400).json({
                success: false,
                message: 'File ID and username are required'
            });
        }
        
        // Remove sharing
        await removeShare(fileId, username, user.token);
        
        return res.status(200).json({
            success: true,
            message: `Sharing removed for ${username}`
        });
    } catch (error) {
        console.error('Remove sharing error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to remove sharing'
        });
    }
});

module.exports = router;
