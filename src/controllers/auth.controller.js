/**
 * Authentication Controller
 * Handles user authentication, registration, and related operations
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

/**
 * Render the login/registration page
 */
const getAuthPage = (req, res) => {
    // If already authenticated, redirect to explorer
    if (req.session.user) {
        return res.redirect('/explorer');
    }
    
    return res.render('auth', {
        title: 'BDPADrive - Authentication',
        error: null,
        success: null
    });
};

/**
 * Handle user login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.render('auth', {
                title: 'BDPADrive - Authentication',
                error: 'Username and password are required',
                success: null
            });
        }
        
        // Call the API to authenticate the user
        const response = await apiClient({
            method: 'POST',
            url: '/users/session',
            data: {
                username,
                password
            }
        });
        
        if (response.data && response.data.token) {
            // Store user session data
            req.session.user = {
                username,
                token: response.data.token
            };
            
            return res.redirect('/explorer');
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Login error:', error);
        
        const errorMessage = error.response?.data?.message || 
                             'Failed to login. Please check your credentials.';
        
        return res.render('auth', {
            title: 'BDPADrive - Authentication',
            error: errorMessage,
            success: null
        });
    }
};

/**
 * Handle user registration
 */
const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.render('auth', {
                title: 'BDPADrive - Authentication',
                error: 'Username, password, and email are required',
                success: null
            });
        }
        
        // Call the API to register the user
        await apiClient({
            method: 'POST',
            url: '/users',
            data: {
                username,
                password,
                email
            }
        });
        
        return res.render('auth', {
            title: 'BDPADrive - Authentication',
            error: null,
            success: 'Registration successful. Please login.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        const errorMessage = error.response?.data?.message || 
                             'Failed to register. Please try again.';
        
        return res.render('auth', {
            title: 'BDPADrive - Authentication',
            error: errorMessage,
            success: null
        });
    }
};

/**
 * Handle user logout
 */
const logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        
        // Redirect to the login page
        return res.redirect('/auth');
    });
};

module.exports = {
    getAuthPage,
    login,
    register,
    logout
};
