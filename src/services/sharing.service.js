/**
 * Sharing Service
 * Handles file sharing functionality
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Share a file with another user
 * @param {string} fileId - The ID of the file to share
 * @param {string} username - The username of the user to share with
 * @param {string} permission - The permission level (read, write)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Sharing result
 */
const shareFile = async (fileId, username, permission, token) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/share`,
            data: {
                username,
                permission: permission || 'read'
            },
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get sharing information for a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of sharing permissions
 */
const getShareInfo = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/filesystem/id/${fileId}/share`,
            token
        });
        
        return response.data || [];
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Remove sharing for a file
 * @param {string} fileId - The ID of the file
 * @param {string} username - The username of the user to remove sharing for
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const removeShare = async (fileId, username, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/id/${fileId}/share/${username}`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

module.exports = {
    shareFile,
    getShareInfo,
    removeShare
};
