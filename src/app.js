/**
 * BDPADrive - Main Application Entry Point
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'bdpadrive-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Configuration
const API_BASE_URL = 'https://drive.api.hscc.bdpa.org/v1';

// Routes
const authRoutes = require('./routes/auth.routes');
const explorerRoutes = require('./routes/explorer.routes');
const editorRoutes = require('./routes/editor.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const apiRoutes = require('./routes/api.routes');
const sharingRoutes = require('./routes/sharing.routes');
const versionRoutes = require('./routes/version.routes');
const trashRoutes = require('./routes/trash.routes');

// Use routes
app.use('/auth', authRoutes);
app.use('/explorer', explorerRoutes);
app.use('/editor', editorRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);
app.use('/share', sharingRoutes);
app.use('/versions', versionRoutes);
app.use('/trash', trashRoutes);

// Home route - redirect to explorer or auth based on authentication status
app.get('/', (req, res) => {
    // If user is authenticated, redirect to explorer, otherwise redirect to auth
    if (req.session.user) {
        return res.redirect('/explorer');
    }
    return res.redirect('/auth');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
