/**
 * Version Service
 * Handles file versioning functionality
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Get versions of a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of file versions
 */
const getFileVersions = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/filesystem/id/${fileId}/versions`,
            token
        });
        
        return response.data || [];
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Create a new version of a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @param {Object} fileData - Updated file data
 * @returns {Promise<Object>} Created version data
 */
const createFileVersion = async (fileId, token, fileData) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/versions`,
            data: fileData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Restore a specific version of a file
 * @param {string} fileId - The ID of the file
 * @param {string} versionId - The ID of the version to restore
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Restored file data
 */
const restoreFileVersion = async (fileId, versionId, token) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/versions/${versionId}/restore`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Delete a specific version of a file
 * @param {string} fileId - The ID of the file
 * @param {string} versionId - The ID of the version to delete
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const deleteFileVersion = async (fileId, versionId, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/id/${fileId}/versions/${versionId}`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

module.exports = {
    getFileVersions,
    createFileVersion,
    restoreFileVersion,
    deleteFileVersion
};
