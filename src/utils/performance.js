/**
 * Performance Utilities
 * Functions to improve application performance
 */

// In-memory cache for frequently accessed data
const cache = new Map();

/**
 * Cache middleware for API responses
 * @param {string} key - Cache key prefix
 * @param {number} ttl - Time to live in milliseconds
 */
const cacheMiddleware = (key, ttl = 60000) => {
    return (req, res, next) => {
        // Generate cache key based on URL and params
        const cacheKey = `${key}_${req.originalUrl}_${JSON.stringify(req.params)}`;
        
        // Check if we have a cached response
        const cachedItem = cache.get(cacheKey);
        if (cachedItem && (Date.now() - cachedItem.timestamp) < ttl) {
            return res.json(cachedItem.data);
        }
        
        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function(data) {
            if (res.statusCode === 200 && !req.skipCache) {
                cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
            }
            return originalJson.call(this, data);
        };
        
        next();
    };
};

/**
 * Clear cache entries by key prefix
 * @param {string} keyPrefix - Key prefix to match
 */
const clearCache = (keyPrefix) => {
    for (const key of cache.keys()) {
        if (key.startsWith(keyPrefix)) {
            cache.delete(key);
        }
    }
};

/**
 * Rate limiting to prevent abuse
 * @param {number} maxRequests - Maximum requests in window
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        // Initialize or clean up old requests
        if (!requests.has(ip)) {
            requests.set(ip, []);
        }
        
        const userRequests = requests.get(ip).filter(time => now - time < windowMs);
        
        if (userRequests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later'
            });
        }
        
        // Add current request timestamp
        userRequests.push(now);
        requests.set(ip, userRequests);
        
        next();
    };
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Compress response data to reduce bandwidth
 * @param {Object} data - Data to compress
 */
const compressData = (data) => {
    // Remove unnecessary fields for client-side rendering
    if (Array.isArray(data)) {
        return data.map(item => sanitizeItem(item));
    }
    
    return sanitizeItem(data);
};

/**
 * Sanitize an item for client-side rendering
 * @param {Object} item - Item to sanitize
 */
const sanitizeItem = (item) => {
    if (!item || typeof item !== 'object') return item;
    
    // Create a shallow copy
    const sanitized = { ...item };
    
    // Remove sensitive or unnecessary fields
    delete sanitized.token;
    delete sanitized.__v;
    delete sanitized.password;
    
    return sanitized;
};

module.exports = {
    cacheMiddleware,
    clearCache,
    rateLimit,
    debounce,
    compressData
};
