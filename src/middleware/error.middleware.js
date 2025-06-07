/**
 * Error Handling Middleware
 * Provides consistent error handling across the application
 */

/**
 * 404 Not Found middleware
 * Handles requests to non-existent routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

/**
 * Global error handler
 * Handles all errors in the application
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);
    
    // Set default status code and message
    const statusCode = err.status || 500;
    const message = err.message || 'Something went wrong';
    
    // Format different for API requests vs. page requests
    const isApiRequest = req.originalUrl.startsWith('/api');
    
    if (isApiRequest) {
        // API response
        return res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } else {
        // Page response
        return res.status(statusCode).render('error', {
            title: `BDPADrive - Error ${statusCode}`,
            message,
            error: {
                status: statusCode,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            }
        });
    }
};

/**
 * XSS Protection middleware
 * Helps prevent cross-site scripting attacks
 */
const xssProtection = (req, res, next) => {
    // Set common security headers
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
    
    next();
};

module.exports = {
    notFoundHandler,
    errorHandler,
    xssProtection
};
