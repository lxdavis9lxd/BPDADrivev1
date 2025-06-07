/**
 * Main JavaScript file for BDPADrive
 */

/**
 * Shows a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, danger, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 fade-in`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Create toast content
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

/**
 * Handles API errors and displays appropriate messages
 * @param {Error} error - The error object
 */
function handleApiError(error) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
        // The request was made and the server responded with a status code
        // outside the range of 2xx
        errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
        
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
            // Redirect to login page
            window.location.href = '/auth';
            return;
        }
        
        // Handle 404 Not Found
        if (error.response.status === 404) {
            errorMessage = 'The requested resource was not found';
        }
        
        // Handle 500 Internal Server Error
        if (error.response.status === 500) {
            errorMessage = 'Server error. Please try again later';
        }
        
        // Handle 555 API Error (specific to this API)
        if (error.response.status === 555) {
            errorMessage = 'The API is temporarily unavailable. Please try again';
        }
    } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your connection';
    } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'Request failed. Please try again';
    }
    
    showNotification(errorMessage, 'danger');
}

/**
 * Formats a timestamp to a human-readable date string
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
}

/**
 * Formats a file size in bytes to a human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
    if (bytes === 0 || bytes === undefined) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Perform an advanced search for files and folders
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Array>} Search results
 */
async function searchFiles(searchParams) {
    try {
        // Build query string from search parameters
        const queryString = Object.keys(searchParams)
            .filter(key => searchParams[key])
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
            .join('&');
        
        const response = await fetch(`/api/search?${queryString}`);
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed: ' + error.message, 'danger');
        return [];
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle global AJAX errors
    window.addEventListener('error', function(event) {
        showNotification('An error occurred: ' + event.message, 'danger');
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Handle search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (searchButton && searchInput) {
        // Search on button click
        searchButton.addEventListener('click', function() {
            handleSearch();
        });
        
        // Search on Enter key
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
        
        function handleSearch() {
            const query = searchInput.value.trim();
            if (query) {
                // Redirect to search results
                window.location.href = `/explorer?search=${encodeURIComponent(query)}`;
            }
        }
    }
});
