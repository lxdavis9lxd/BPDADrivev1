/**
 * API configuration and utility functions
 */
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'https://drive.api.hscc.bdpa.org/v1';

// Create an axios instance with base URL and default headers
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Custom request method that handles token in a consistent way
const makeRequest = async (config) => {
    try {
        // Extract token from config if provided
        const token = config.token;
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        
        // Remove token from config to avoid axios warnings
        delete config.token;
        
        return await apiClient(config);
    } catch (error) {
        // Handle specific API errors
        if (error.response && error.response.status === 555) {
            console.log('API returned a 555 error. Retrying request...');
            // You could implement retry logic here
        }
        
        throw error;
    }
};

module.exports = {
    apiClient: makeRequest,
    API_BASE_URL
};
