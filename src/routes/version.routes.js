/**
 * Version Routes
 */
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.middleware');
const { getFileVersions, createFileVersion, restoreFileVersion, deleteFileVersion } = require('../services/version.service');
const { getFileById } = require('../services/filesystem.service');
const { formatDate } = require('../utils/helpers');

// Apply authentication middleware to all version routes
router.use(isAuthenticated);

/**
 * GET /versions/:fileId - Get versions for a file
 */
router.get('/:fileId', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).render('error', {
                message: 'File ID is required',
                error: { status: 400 }
            });
        }
        
        // Get file details
        const fileData = await getFileById(fileId, user.token);
        
        // Get versions
        const versions = await getFileVersions(fileId, user.token);
        
        // Format versions for display
        const formattedVersions = versions.map(version => ({
            ...version,
            formattedCreatedAt: formatDate(version.createdAt)
        }));
        
        return res.render('versions', {
            title: `BDPADrive - Versions - ${fileData.name}`,
            user: user.username,
            file: fileData,
            versions: formattedVersions,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Get versions error:', error);
        
        return res.status(error.status || 500).render('error', {
            message: error.message || 'Failed to retrieve versions',
            error: error
        });
    }
});

/**
 * POST /versions/:fileId - Create a new version
 */
router.post('/:fileId', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        const { content, comment } = req.body;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Create new version
        const versionData = {
            content,
            comment: comment || `Version created on ${new Date().toLocaleString()}`
        };
        
        await createFileVersion(fileId, user.token, versionData);
        
        return res.status(201).json({
            success: true,
            message: 'Version created successfully'
        });
    } catch (error) {
        console.error('Create version error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to create version'
        });
    }
});

/**
 * POST /versions/:fileId/:versionId/restore - Restore a specific version
 */
router.post('/:fileId/:versionId/restore', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId, versionId } = req.params;
        
        if (!fileId || !versionId) {
            return res.status(400).json({
                success: false,
                message: 'File ID and version ID are required'
            });
        }
        
        // Restore version
        await restoreFileVersion(fileId, versionId, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'Version restored successfully'
        });
    } catch (error) {
        console.error('Restore version error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to restore version'
        });
    }
});

/**
 * DELETE /versions/:fileId/:versionId - Delete a specific version
 */
router.delete('/:fileId/:versionId', async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId, versionId } = req.params;
        
        if (!fileId || !versionId) {
            return res.status(400).json({
                success: false,
                message: 'File ID and version ID are required'
            });
        }
        
        // Delete version
        await deleteFileVersion(fileId, versionId, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'Version deleted successfully'
        });
    } catch (error) {
        console.error('Delete version error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to delete version'
        });
    }
});

module.exports = router;
