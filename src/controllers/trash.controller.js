/**
 * Trash Controller
 * Handles trash/recycle bin functionality
 */
const { listTrash, restoreFromTrash, deleteFromTrash, emptyTrash } = require('../services/trash.service');
const { formatDate, formatFileSize } = require('../utils/helpers');

/**
 * Render the trash view with user's trashed files
 */
const getTrashView = async (req, res) => {
    try {
        const { user } = req.session;
        
        // Get trashed files
        const trashedFiles = await listTrash(user.username, user.token);
        
        // Format data for the view
        const formattedFiles = trashedFiles.map(file => ({
            ...file,
            formattedCreatedAt: formatDate(file.createdAt),
            formattedModifiedAt: formatDate(file.modifiedAt),
            formattedDeletedAt: formatDate(file.deletedAt),
            formattedSize: formatFileSize(file.size || 0),
            // Add additional properties for the view
            isDirectory: file.type === 'directory',
            isFile: file.type === 'file',
            isSymlink: file.type === 'symlink'
        }));
        
        // Sort by deletion date (newest first)
        formattedFiles.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
        
        return res.render('trash', {
            title: 'BDPADrive - Trash',
            user: user.username,
            files: formattedFiles,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Trash view error:', error);
        
        return res.render('trash', {
            title: 'BDPADrive - Trash',
            user: req.session.user.username,
            files: [],
            error: error.message || 'Failed to load trash',
            success: null
        });
    }
};

/**
 * Restore a file from trash
 */
const restoreFile = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Restore the file
        await restoreFromTrash(fileId, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'File restored successfully'
        });
    } catch (error) {
        console.error('Restore file error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to restore file'
        });
    }
};

/**
 * Permanently delete a file from trash
 */
const deleteFilePermanently = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Delete the file permanently
        await deleteFromTrash(fileId, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'File permanently deleted'
        });
    } catch (error) {
        console.error('Delete file permanently error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to delete file'
        });
    }
};

/**
 * Empty the trash (delete all files in trash)
 */
const emptyTrashBin = async (req, res) => {
    try {
        const { user } = req.session;
        
        // Empty the trash
        await emptyTrash(user.username, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'Trash emptied successfully'
        });
    } catch (error) {
        console.error('Empty trash error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to empty trash'
        });
    }
};

module.exports = {
    getTrashView,
    restoreFile,
    deleteFilePermanently,
    emptyTrashBin
};
