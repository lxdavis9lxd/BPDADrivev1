/**
 * Profile Controller
 * Handles user profile management
 */
const { 
    getUserProfile, 
    updateUserProfile, 
    updateUserPassword,
    getUserPreferences,
    updateUserPreferences
} = require('../services/profile.service');

/**
 * Render profile page
 */
const getProfilePage = async (req, res) => {
    try {
        const { user } = req.session;
        
        // Get user profile data
        const profileData = await getUserProfile(user.username, user.token);
        
        // Get user preferences
        const preferences = await getUserPreferences(user.username, user.token);
        
        return res.render('profile', {
            title: 'BDPADrive - Profile',
            user: user.username,
            profile: profileData,
            preferences: preferences,
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Profile page error:', error);
        
        return res.render('profile', {
            title: 'BDPADrive - Profile',
            user: req.session.user.username,
            profile: {},
            preferences: {},
            error: error.message || 'Failed to load profile data',
            success: null
        });
    }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { user } = req.session;
        const profileData = req.body;
        
        if (!profileData) {
            return res.status(400).json({
                success: false,
                message: 'Profile data is required'
            });
        }
        
        // Update profile
        await updateUserProfile(user.username, user.token, profileData);
        
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update profile'
        });
    }
};

/**
 * Update user password
 */
const changePassword = async (req, res) => {
    try {
        const { user } = req.session;
        const { currentPassword, newPassword, confirmPassword } = req.body;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All password fields are required'
            });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirmation do not match'
            });
        }
        
        // Update password
        await updateUserPassword(user.username, user.token, {
            currentPassword,
            newPassword
        });
        
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to change password'
        });
    }
};

/**
 * Update user preferences
 */
const updatePreferences = async (req, res) => {
    try {
        const { user } = req.session;
        const preferences = req.body;
        
        if (!preferences) {
            return res.status(400).json({
                success: false,
                message: 'Preferences data is required'
            });
        }
        
        // Update preferences
        await updateUserPreferences(user.username, user.token, preferences);
        
        return res.status(200).json({
            success: true,
            message: 'Preferences updated successfully'
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update preferences'
        });
    }
};

module.exports = {
    getProfilePage,
    updateProfile,
    changePassword,
    updatePreferences
};
