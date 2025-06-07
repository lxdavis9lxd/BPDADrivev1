/**
 * Utility helper functions
 */

/**
 * Format timestamp to human-readable date
 * @param {number} timestamp - Milliseconds since epoch
 * @returns {string} Formatted date string
 */
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
};

/**
 * Format file size to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "2.5 KB")
 */
const formatFileSize = (bytes) => {
    if (bytes === 0 || bytes === undefined) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Safely encode text to prevent XSS vulnerabilities
 * @param {string} text - Input text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeText = (text) => {
    if (!text) return '';
    
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

/**
 * Handle API errors in a consistent way
 * @param {Error} error - The error object
 * @returns {Object} Standardized error object with message
 */
const handleApiError = (error) => {
    let message = 'An unexpected error occurred';
    let status = 500;
    
    if (error.response) {
        // The request was made and the server responded with a status code
        // outside the range of 2xx
        message = error.response.data.message || `Error: ${error.response.status}`;
        status = error.response.status;
    } else if (error.request) {
        // The request was made but no response was received
        message = 'No response received from server';
        status = 503;
    } else {
        // Something happened in setting up the request that triggered an Error
        message = error.message;
    }
    
    return {
        message,
        status,
        error: true,
        originalError: error
    };
};

module.exports = {
    formatDate,
    formatFileSize,
    sanitizeText,
    handleApiError
};
