/**
 * Editor Controller
 * Handles file editing functionality
 */
const { getFileById, updateFile } = require('../services/filesystem.service');
const { createFileVersion } = require('../services/version.service');
const { formatDate } = require('../utils/helpers');
const markdownIt = require('markdown-it')();

/**
 * Render the editor view for a specific file
 */
const getEditorView = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        
        if (!fileId) {
            return res.status(400).render('error', {
                message: 'File ID is required',
                error: { status: 400 }
            });
        }
        
        // Get the file data
        const fileData = await getFileById(fileId, user.token);
        
        // Check if the file is a text file
        if (fileData.type !== 'file') {
            return res.status(400).render('error', {
                message: 'Only text files can be edited',
                error: { status: 400 }
            });
        }
        
        // Extract tags from the file data or initialize an empty array
        const tags = fileData.tags || [];
        
        // Format dates for display
        const formattedCreatedAt = formatDate(fileData.createdAt);
        const formattedModifiedAt = formatDate(fileData.modifiedAt);
        
        // Render markdown preview
        const htmlPreview = markdownIt.render(fileData.content || '');
        
        return res.render('editor', {
            title: `BDPADrive - Editor - ${fileData.name}`,
            user: user.username,
            file: {
                ...fileData,
                formattedCreatedAt,
                formattedModifiedAt,
                tags
            },
            preview: htmlPreview,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Editor view error:', error);
        
        return res.status(error.status || 500).render('error', {
            message: error.message || 'Failed to load file',
            error: { status: error.status || 500 }
        });
    }
};

/**
 * Save file content
 */
const saveFile = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        const { content, createVersion } = req.body;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Get the current file data first
        const fileData = await getFileById(fileId, user.token);
        
        // If content is different, create a version before updating
        if (createVersion !== false && fileData.content !== content) {
            try {
                // Create a version with the current content
                await createFileVersion(fileId, user.token, {
                    content: fileData.content,
                    comment: `Automatic version created on ${new Date().toLocaleString()}`
                });
            } catch (versionError) {
                console.error('Create version error:', versionError);
                // Continue with save even if version creation fails
            }
        }
        
        // Update the file content
        await updateFile(fileId, user.token, { content });
        
        return res.status(200).json({
            success: true,
            message: 'File saved successfully'
        });
    } catch (error) {
        console.error('Save file error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to save file'
        });
    }
};

/**
 * Get rendered markdown preview
 */
const getMarkdownPreview = async (req, res) => {
    try {
        const { content } = req.body;
        
        // Render markdown to HTML
        const htmlPreview = markdownIt.render(content || '');
        
        return res.status(200).json({
            success: true,
            preview: htmlPreview
        });
    } catch (error) {
        console.error('Markdown preview error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to generate preview',
            preview: ''
        });
    }
};

/**
 * Update file tags
 */
const updateFileTags = async (req, res) => {
    try {
        const { user } = req.session;
        const { fileId } = req.params;
        const { tags } = req.body;
        
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }
        
        // Get the current file data
        const fileData = await getFileById(fileId, user.token);
        
        // Update the file with new tags
        await updateFile(fileId, user.token, { 
            ...fileData,
            tags: Array.isArray(tags) ? tags : []
        });
        
        return res.status(200).json({
            success: true,
            message: 'Tags updated successfully'
        });
    } catch (error) {
        console.error('Update tags error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update tags'
        });
    }
};

module.exports = {
    getEditorView,
    saveFile,
    getMarkdownPreview,
    updateFileTags
};
