/**
 * Comment Service
 * Handles file commenting functionality
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Get comments for a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of comments
 */
const getFileComments = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/filesystem/id/${fileId}/comments`,
            token
        });
        
        return response.data || [];
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Add a comment to a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @param {Object} commentData - Comment data (content)
 * @returns {Promise<Object>} Created comment data
 */
const addFileComment = async (fileId, token, commentData) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/comments`,
            data: commentData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Update a comment
 * @param {string} fileId - The ID of the file
 * @param {string} commentId - The ID of the comment
 * @param {string} token - Authentication token
 * @param {Object} commentData - Updated comment data
 * @returns {Promise<Object>} Updated comment data
 */
const updateFileComment = async (fileId, commentId, token, commentData) => {
    try {
        const response = await apiClient({
            method: 'PUT',
            url: `/filesystem/id/${fileId}/comments/${commentId}`,
            data: commentData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Delete a comment
 * @param {string} fileId - The ID of the file
 * @param {string} commentId - The ID of the comment
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const deleteFileComment = async (fileId, commentId, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/id/${fileId}/comments/${commentId}`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

module.exports = {
    getFileComments,
    addFileComment,
    updateFileComment,
    deleteFileComment
};
