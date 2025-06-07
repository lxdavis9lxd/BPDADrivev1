/**
 * Authentication Middleware
 * Ensures routes are accessible only to authenticated users
 */

/**
 * Middleware to check if user is authenticated
 */
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // User is authenticated
        return next();
    }
    
    // User is not authenticated, redirect to login
    return res.redirect('/auth');
};

/**
 * Middleware to check if user is NOT authenticated (for auth pages)
 */
const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        // User is not authenticated
        return next();
    }
    
    // User is authenticated, redirect to explorer
    return res.redirect('/explorer');
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
