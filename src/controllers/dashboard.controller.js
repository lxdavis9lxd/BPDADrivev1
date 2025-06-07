/**
 * Dashboard Controller
 * Handles user profile and account management
 */
const { apiClient } = require('../utils/api.config');
const { listFiles } = require('../services/filesystem.service');
const { formatFileSize } = require('../utils/helpers');

/**
 * Render the dashboard view with user information
 */
const getDashboardView = async (req, res) => {
    try {
        const { user } = req.session;
        
        // Get user details from the API
        const userResponse = await apiClient({
            method: 'GET',
            url: `/users/${user.username}`,
            token: user.token
        });
        
        const userData = userResponse.data;
        
        // Get all user files to calculate storage usage
        const filesData = await listFiles(user.username, user.token);
        
        // Calculate total storage used (excluding symlinks)
        const totalStorageBytes = filesData
            .filter(file => file.type === 'file')
            .reduce((total, file) => total + (file.size || 0), 0);
        
        const storageUsed = formatFileSize(totalStorageBytes);
        
        return res.render('dashboard', {
            title: 'BDPADrive - Dashboard',
            user: {
                username: userData.username,
                email: userData.email,
                storageUsed
            },
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Dashboard view error:', error);
        
        return res.render('dashboard', {
            title: 'BDPADrive - Dashboard',
            user: {
                username: req.session.user.username,
                email: '',
                storageUsed: '0 Bytes'
            },
            error: error.message || 'Failed to load user data',
            success: null
        });
    }
};

/**
 * Update user email
 */
const updateEmail = async (req, res) => {
    try {
        const { user } = req.session;
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Update user email
        await apiClient({
            method: 'PUT',
            url: `/users/${user.username}`,
            data: { email },
            token: user.token
        });
        
        return res.status(200).json({
            success: true,
            message: 'Email updated successfully'
        });
    } catch (error) {
        console.error('Update email error:', error);
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to update email'
        });
    }
};

/**
 * Update user password
 */
const updatePassword = async (req, res) => {
    try {
        const { user } = req.session;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        
        // Verify current password
        try {
            await apiClient({
                method: 'POST',
                url: '/users/session',
                data: {
                    username: user.username,
                    password: currentPassword
                }
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update user password
        await apiClient({
            method: 'PUT',
            url: `/users/${user.username}`,
            data: { password: newPassword },
            token: user.token
        });
        
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to update password'
        });
    }
};

/**
 * Delete user account
 */
const deleteAccount = async (req, res) => {
    try {
        const { user } = req.session;
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required to delete account'
            });
        }
        
        // Verify password
        try {
            await apiClient({
                method: 'POST',
                url: '/users/session',
                data: {
                    username: user.username,
                    password
                }
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            });
        }
        
        // Delete user account
        await apiClient({
            method: 'DELETE',
            url: `/users/${user.username}`,
            token: user.token
        });
        
        // Destroy session
        req.session.destroy();
        
        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to delete account'
        });
    }
};

module.exports = {
    getDashboardView,
    updateEmail,
    updatePassword,
    deleteAccount
};
