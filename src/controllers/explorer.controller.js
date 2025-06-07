/**
 * Explorer Controller
 * Handles file and folder exploration functionality
 */
const { listFiles, createFile, deleteFile, updateFile } = require('../services/filesystem.service');
const { searchFiles } = require('../services/filesystem.service');
const { moveToTrash } = require('../services/trash.service');
const { formatDate, formatFileSize } = require('../utils/helpers');
const markdownIt = require('markdown-it')();

/**
 * Render the explorer view with user's files and folders
 */
const getExplorerView = async (req, res) => {
    try {
        const { user } = req.session;
        const path = req.query.path || '/';
        const searchQuery = req.query.search;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20; // Default items per page
        
        let filesData;
        let isSearchResult = false;
        
        // If search query is provided, use search function instead of list
        if (searchQuery) {
            filesData = await searchFiles(user.username, user.token, { 
                query: searchQuery,
                page,
                limit
            });
            isSearchResult = true;
        } else {
            // Otherwise get files and folders from the specified path
            filesData = await listFiles(user.username, user.token, path);
        }
        
        // Format data for the view
        const formattedFiles = filesData.map(file => ({
            ...file,
            formattedCreatedAt: formatDate(file.createdAt),
            formattedModifiedAt: formatDate(file.modifiedAt),
            formattedSize: formatFileSize(file.size || 0),
            // Add additional properties for the view
            isDirectory: file.type === 'directory',
            isFile: file.type === 'file',
            isSymlink: file.type === 'symlink'
        }));
        
        // Separate directories and files for display
        const directories = formattedFiles.filter(item => item.isDirectory);
        const files = formattedFiles.filter(item => item.isFile || item.isSymlink);
        
        // Sort by name by default
        directories.sort((a, b) => a.name.localeCompare(b.name));
        files.sort((a, b) => a.name.localeCompare(b.name));
        
        // Calculate pagination
        const totalItems = directories.length + files.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        // Get paginated results
        const paginatedDirectories = directories.slice(
            startIndex, 
            Math.min(endIndex, directories.length)
        );
        
        let paginatedFiles = [];
        if (endIndex > directories.length) {
            // If we still have space for files after directories
            const remainingSpace = endIndex - directories.length;
            paginatedFiles = files.slice(0, remainingSpace);
        }
        
        return res.render('explorer', {
            title: 'BDPADrive - Explorer',
            user: user.username,
            currentPath: path,
            directories: paginatedDirectories,
            files: paginatedFiles,
            isSearchResult,
            searchQuery: searchQuery || '',
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Explorer view error:', error);
        
        return res.render('explorer', {
            title: 'BDPADrive - Explorer',
            user: req.session.user.username,
            currentPath: req.query.path || '/',
            directories: [],
            files: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                limit: 20,
                hasNextPage: false,
                hasPrevPage: false
            },
            error: error.message || 'Failed to load files',
            success: null
        });
    }
};

/**
 * Create a new file or folder
 */
const createFileOrFolder = async (req, res) => {
    try {
        const { user } = req.session;
        const { name, type, parentPath } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({
                success: false,
                message: 'Name and type are required'
            });
        }
        
        // Create new file or folder
        const newItem = {
            name,
            type,
            parent: parentPath || '/',
            content: type === 'file' ? '' : undefined
        };
        
        await createFile(user.username, user.token, newItem);
        
        return res.status(201).json({
            success: true,
            message: `${type === 'directory' ? 'Folder' : 'File'} created successfully`
        });
    } catch (error) {
        console.error('Create file/folder error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to create item'
        });
    }
};

/**
 * Delete a file or folder
 */
const deleteFileOrFolder = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Move to trash instead of permanent deletion
        await moveToTrash(fileId, user.token);
        
        return res.status(200).json({
            success: true,
            message: 'Item moved to trash'
        });
    } catch (error) {
        console.error('Delete file/folder error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to delete item'
        });
    }
};

/**
 * Rename a file or folder
 */
const renameFileOrFolder = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        const { newName } = req.body;
        
        if (!fileId || !newName) {
            return res.status(400).json({
                success: false,
                message: 'File ID and new name are required'
            });
        }
        
        // Update the file name
        await updateFile(fileId, user.token, { name: newName });
        
        return res.status(200).json({
            success: true,
            message: 'Item renamed successfully'
        });
    } catch (error) {
        console.error('Rename file/folder error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to rename item'
        });
    }
};

/**
 * Generate a thumbnail preview for a text file
 */
const generateThumbnail = (content) => {
    try {
        if (!content) return '';
        
        // Truncate content for preview (first few lines)
        const previewContent = content.split('\n').slice(0, 5).join('\n');
        
        // Render markdown to HTML
        const htmlContent = markdownIt.render(previewContent);
        
        // For real implementation, you would convert HTML to an image here
        // For this example, we'll just return the HTML
        return htmlContent;
    } catch (error) {
        console.error('Thumbnail generation error:', error);
        return '';
    }
};

module.exports = {
    getExplorerView,
    createFileOrFolder,
    deleteFileOrFolder,
    renameFileOrFolder,
    generateThumbnail
};
