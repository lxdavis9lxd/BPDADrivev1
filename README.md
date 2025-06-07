# BDPADrive

A web-based file management and word processing application built for the BDPA National High School Computer Competition (NHSCC) 2025.

## Overview

BDPADrive is a sleek, modern web application that allows users to create, edit, and manage text files and folders. It features a user-friendly interface with Explorer, Editor, Dashboard, and Authentication views.

## Features

### User Management
- User authentication (login, registration, logout)
- User profile management (update email, change password)
- Account deletion
- Password recovery via email

### File Management
- Create, view, edit, and delete text files
- Create, view, and delete folders
- Rename files and folders
- File previews with Markdown rendering
- Real-time preview updates during editing
- Automatic file saving
- File search functionality
- File versioning with history tracking
- File tagging for better organization
- File sharing with other users
- File locking to prevent concurrent editing conflicts
- Trash/recycle bin for temporary file storage

### Application Improvements
- Responsive design for all device viewports
- Performance optimizations with caching
- Pagination for file lists and search results
- Live preview updates without page refresh
- Graceful failure handling

### Security
- Protected routes for authenticated users
- Password hashing for user security
- XSS protection and secure headers
- CSRF protection
- Input validation
- Rate limiting to prevent abuse

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, EJS templates
- **Backend**: Node.js, Express.js
- **Database**: Uses external BDPA API service for data storage
- **Authentication**: JWT (JSON Web Tokens), Session management
- **Security**: bcryptjs for password hashing, XSS protection headers
- **Email**: Nodemailer for sending password reset emails
- **Performance**: Custom caching and rate limiting implementations

## BDPA NHSCC 2025 Requirements Compliance

This application implements all the required features as specified in the BDPA NHSCC 2025 problem statement:

1. ✅ User authentication and management
2. ✅ File and folder management
3. ✅ File sharing functionality
4. ✅ File tagging for organization
5. ✅ Enhanced search capabilities
6. ✅ File locking to prevent concurrent editing conflicts
7. ✅ Email recovery for forgotten passwords
8. ✅ File versioning system
9. ✅ Trash/recycle bin functionality
10. ✅ Live preview updates without page refresh
11. ✅ Performance optimization with caching
12. ✅ Pagination for file lists and search results
13. ✅ Security against XSS and other vulnerabilities
14. ✅ Graceful failure handling
15. ✅ Responsive UI design for all device viewports

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/bdpa/bdpadrive.git
   cd bdpadrive
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   SESSION_SECRET=your_session_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@bdpadrive.org
   APP_URL=http://localhost:3000
   ```

4. Start the application:
   ```
   npm start
   ```

5. For development with auto-reload:
   ```
   npm run dev
   ```

## Project Structure

- `/src` - Source code
  - `/controllers` - Route controllers
  - `/middleware` - Express middleware
  - `/models` - Data models
  - `/public` - Static assets (CSS, JavaScript, images)
  - `/routes` - Express routes
  - `/services` - Business logic and API integration
  - `/utils` - Helper functions
  - `/views` - EJS templates
  - `app.js` - Application entry point

## License

This project is licensed under the ISC License.