/**
 * User Profile Service
 * Handles user profile management
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Get user profile information
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User profile data
 */
const getUserProfile = async (username, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/users/${username}/profile`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Update user profile information
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile data
 */
const updateUserProfile = async (username, token, profileData) => {
    try {
        const response = await apiClient({
            method: 'PUT',
            url: `/users/${username}/profile`,
            data: profileData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Update user password
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @param {Object} passwordData - Password data (currentPassword, newPassword)
 * @returns {Promise<Object>} Response data
 */
const updateUserPassword = async (username, token, passwordData) => {
    try {
        const response = await apiClient({
            method: 'PUT',
            url: `/users/${username}/password`,
            data: passwordData,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Get user preferences
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User preferences
 */
const getUserPreferences = async (username, token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/users/${username}/preferences`,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Update user preferences
 * @param {string} username - The username of the user
 * @param {string} token - Authentication token
 * @param {Object} preferences - Updated preferences
 * @returns {Promise<Object>} Updated preferences
 */
const updateUserPreferences = async (username, token, preferences) => {
    try {
        const response = await apiClient({
            method: 'PUT',
            url: `/users/${username}/preferences`,
            data: preferences,
            token
        });
        
        return response.data || {};
    } catch (error) {
        throw handleApiError(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    getUserPreferences,
    updateUserPreferences
};
