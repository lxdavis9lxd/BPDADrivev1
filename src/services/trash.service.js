/**
 * Trash Service
 * Handles trash/recycle bin functionality
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Move a file to trash instead of deleting it
 * @param {string} fileId - The ID of the file to trash
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const moveToTrash = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/trash`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get list of files in the trash
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of trashed files
 */
const listTrash = async (username, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/filesystem/${username}/trash`,
            token
        });
        
        return response.data || [];
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Restore a file from trash
 * @param {string} fileId - The ID of the file to restore
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const restoreFromTrash = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/restore`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Permanently delete a file from trash
 * @param {string} fileId - The ID of the file to delete permanently
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const deleteFromTrash = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/id/${fileId}/trash`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Empty the trash (delete all files in trash)
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const emptyTrash = async (username, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/${username}/trash`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

module.exports = {
    moveToTrash,
    listTrash,
    restoreFromTrash,
    deleteFromTrash,
    emptyTrash
};
