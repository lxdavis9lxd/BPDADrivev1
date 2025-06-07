/**
 * Lock Service
 * Handles file locking functionality to prevent conflicts
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Get lock information for a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Object|null>} Lock information or null if no lock
 */
const getFileLock = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/filesystem/id/${fileId}/lock`,
            token
        });
        
        return response.data || null;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Acquire a lock on a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @param {Object} lockData - Lock data with user and client IDs
 * @returns {Promise<Object>} Lock data
 */
const acquireFileLock = async (fileId, token, lockData) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: `/filesystem/id/${fileId}/lock`,
            data: lockData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Release a lock on a file
 * @param {string} fileId - The ID of the file
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Response data
 */
const releaseFileLock = async (fileId, token) => {
    try {
        const response = await apiClient({
            method: 'DELETE',
            url: `/filesystem/id/${fileId}/lock`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generate a unique client ID for lock identification
 * @returns {string} Unique client ID
 */
const generateClientId = () => {
    return `client-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
};

module.exports = {
    getFileLock,
    acquireFileLock,
    releaseFileLock,
    generateClientId
};
