/**
 * Authentication Controller
 * Handles user authentication, registration, and related operations
 */
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');
const { generateResetToken, verifyResetToken, resetPassword, sendPasswordResetEmail } = require('../services/email.service');

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

/**
 * Render the forgot password page
 */
const getForgotPasswordPage = (req, res) => {
    return res.render('forgot-password', {
        title: 'BDPADrive - Forgot Password',
        error: null,
        success: null
    });
};

/**
 * Handle forgot password request
 */
const forgotPassword = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username || !email) {
            return res.render('forgot-password', {
                title: 'BDPADrive - Forgot Password',
                error: 'Username and email are required',
                success: null
            });
        }
        
        // Generate reset token
        const resetData = await generateResetToken(username);
        
        // Send password reset email
        await sendPasswordResetEmail(email, username, resetData.token);
        
        return res.render('forgot-password', {
            title: 'BDPADrive - Forgot Password',
            error: null,
            success: 'Password reset instructions have been sent to your email.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        
        const errorMessage = error.response?.data?.message || 
                             'Failed to process your request. Please try again.';
        
        return res.render('forgot-password', {
            title: 'BDPADrive - Forgot Password',
            error: errorMessage,
            success: null
        });
    }
};

/**
 * Render the reset password page
 */
const getResetPasswordPage = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Verify the token
        await verifyResetToken(token);
        
        return res.render('reset-password', {
            title: 'BDPADrive - Reset Password',
            token,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Reset password page error:', error);
        
        return res.render('error', {
            message: 'Invalid or expired password reset token',
            error: { status: 400 }
        });
    }
};

/**
 * Handle password reset
 */
const resetPasswordHandler = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        
        if (!password || !confirmPassword) {
            return res.render('reset-password', {
                title: 'BDPADrive - Reset Password',
                token,
                error: 'Password and confirmation are required',
                success: null
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('reset-password', {
                title: 'BDPADrive - Reset Password',
                token,
                error: 'Passwords do not match',
                success: null
            });
        }
        
        // Reset the password
        await resetPassword(token, password);
        
        return res.render('auth', {
            title: 'BDPADrive - Authentication',
            error: null,
            success: 'Your password has been reset successfully. Please login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        
        const errorMessage = error.response?.data?.message || 
                             'Failed to reset password. Please try again.';
        
        return res.render('reset-password', {
            title: 'BDPADrive - Reset Password',
            token: req.params.token,
            error: errorMessage,
            success: null
        });
    }
};

module.exports = {
    getAuthPage,
    login,
    register,
    logout,
    getForgotPasswordPage,
    forgotPassword,
    getResetPasswordPage,
    resetPasswordHandler
};
