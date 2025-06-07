/**
 * Email Service
 * Handles email functionality for BDPADrive
 */
const nodemailer = require('nodemailer');
const { apiClient } = require('../utils/api.config');
const { handleApiError } = require('../utils/helpers');

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Generate a password reset token
 * @param {string} username - Username of the user
 * @returns {Promise<Object>} - Reset token data
 */
const generateResetToken = async (username) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: '/auth/reset-token',
            data: { username }
        });
        
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Verify a password reset token
 * @param {string} token - Reset token
 * @returns {Promise<Object>} - Token verification result
 */
const verifyResetToken = async (token) => {
    try {
        const response = await apiClient({
            method: 'GET',
            url: `/auth/reset-token/${token}`
        });
        
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Reset password using a token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Password reset result
 */
const resetPassword = async (token, newPassword) => {
    try {
        const response = await apiClient({
            method: 'POST',
            url: '/auth/reset-password',
            data: { token, password: newPassword }
        });
        
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} username - User's username
 * @param {string} resetToken - Reset token
 * @returns {Promise<Object>} - Email sending result
 */
const sendPasswordResetEmail = async (email, username, resetToken) => {
    // Generate reset URL
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;
    
    // Email options
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@bdpadrive.org',
        to: email,
        subject: 'BDPADrive Password Reset',
        html: `
            <h1>BDPADrive Password Reset</h1>
            <p>Hello ${username},</p>
            <p>You have requested to reset your password. Please click the link below to reset your password:</p>
            <p><a href="${resetUrl}">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        `
    };
    
    // Send email
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

module.exports = {
    generateResetToken,
    verifyResetToken,
    resetPassword,
    sendPasswordResetEmail
};
