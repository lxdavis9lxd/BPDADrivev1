# BDPADrive

A web-based file management and word processing application built for the BDPA National High School Computer Competition (NHSCC) 2025.

## Overview

BDPADrive is a sleek, modern web application that allows users to create, edit, and manage text files and folders. It features a user-friendly interface with Explorer, Editor, Dashboard, and Authentication views.

## Features

### User Management
- User authentication (login, registration, logout)
- User profile management (update email, change password)
- Account deletion

### File Management
- Create, view, edit, and delete text files
- Create, view, and delete folders
- Rename files and folders
- File previews with Markdown rendering
- Real-time preview updates during editing
- Automatic file saving
- File search functionality

### Security
- Protected routes for authenticated users
- Password hashing for user security
- XSS protection
- Graceful error handling

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, EJS templating
- **Backend**: Node.js, Express.js
- **API Integration**: Axios for RESTful API calls
- **Markdown Rendering**: markdown-it
- **Authentication**: JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/bdpadrive.git
   cd bdpadrive
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your-session-secret
   API_BASE_URL=https://drive.api.hscc.bdpa.org/v1
   ```

4. Start the application:
   ```
   npm run dev
   ```

5. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## API Integration

This application integrates with the BDPADrive API provided by HSCC. All data operations are performed through API calls, including:

- User authentication
- File and folder management
- Search functionality
- User profile management

## Development

To run the application in development mode with automatic restarts:

```
npm run dev
```

## Deployment

To run the application in production mode:

```
npm start
```

## Implementation Approach

The application has been implemented in chunks of 3 requirements at a time:

1. First Chunk: Authentication, User Management, and Basic App Structure
2. Second Chunk: Explorer View, File/Folder Operations, and Thumbnails
3. Third Chunk: Editor View, Real-time Preview, and Dashboard
4. Fourth Chunk: Search Functionality, Pagination, and Security
5. Fifth Chunk: Performance Optimization, Responsive Design, and Error Handling

## License

This project is licensed under the ISC License.

## Acknowledgements

- BDPA National High School Computer Competition
- Bootstrap for UI components
- markdown-it for Markdown rendering