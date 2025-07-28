# Library Manager Backend

This project is a backend API for a Library Management System, built with Node.js, Express, and MongoDB. It provides user authentication, book management, lending/returning books, audit logging, and email notifications for overdue books.

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Key Files and Their Purpose](#key-files-and-their-purpose)
- [Setup Guide](#setup-guide)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The Library Manager Backend provides RESTful APIs for:

- User registration, login, and management (admin/user roles)
- Book CRUD operations (add, update, delete, fetch)
- Lending and returning books
- Audit logging for key actions
- Email reminders for overdue books
- Dashboard statistics

---

## Folder Structure

```
Backend/
├── src/
│   ├── controllers/         # Route handlers for API endpoints
│   │   ├── v1/
│   │   │   ├── auth/        # Auth controllers (register, login, logout, refreshToken)
│   │   │   ├── books/       # Book controllers (CRUD)
│   │   │   ├── lending/     # Lending controllers (lend, return, history)
│   │   │   ├── user/        # User controllers (CRUD, activate/deactivate)
│   │   │   ├── email/       # Email controllers (send reminders)
│   │   │   ├── audit/       # Audit log controllers
│   │   │   ├── Dashboard/   # Dashboard data controller
│   ├── models/              # Mongoose models (User, Book, Lending, AuditLog, Token)
│   ├── middlewares/         # Express middlewares (auth, validation, file upload)
│   ├── routes/              # Express routers (API endpoints)
│   │   ├── v1/              # Versioned API routes
│   ├── utils/               # Utility functions (email service, username generator)
│   ├── lib/                 # Library code (JWT, logger, rate limiter)
│   ├── db/                  # Database connection logic
│   ├── errors/              # Error handling middlewares
│   ├── config/              # Configuration loader
│   ├── index.ts             # Entry point for the backend server
├── public/
│   └── uploads/             # Uploaded book images
├── .env.example             # Example environment variables
```

---

## Key Files and Their Purpose

### Controllers

- **auth/**: Handles registration, login, logout, and token refresh.
- **books/**: CRUD operations for books.
- **lending/**: Lending/returning books, lending history.
- **user/**: User info, update, delete, activate/deactivate.
- **email/**: Sending reminder emails.
- **audit/**: Fetching audit logs.
- **Dashboard/**: Dashboard statistics.

### Models

- **User.ts**: User schema (admin/user roles, password hashing).
- **Book.ts**: Book schema (title, author, category, image).
- **Lending.ts**: Lending schema (user, book, dates, status).
- **AuditLog.ts**: Audit log schema (action, user, target).
- **token.ts**: Refresh token storage.

### Middlewares

- **jwt/**: Authentication and role-based authorization.
- **validations/**: Request validation for user/auth actions.
- **fileUpload.ts**: Multer config for book image uploads.

### Routes

- **v1/**: API endpoints grouped by resource (auth, user, books, lending, audit, email, dashboard).

### Utils

- **emailService.ts**: Email sending logic (nodemailer).
- **index.ts**: Utility functions (e.g., random username generator).

### Lib

- **jwt.ts**: JWT token generation/verification.
- **winston.ts**: Logging configuration.
- **expressRateLimit.ts**: Rate limiting middleware.

### Errors

- **validationError.ts**: Validation error handler.
- **middelware.ts**: General error handler.

### Config

- **index.ts**: Loads environment variables and app config.

### Entry Point

- **index.ts**: Sets up Express app, middleware, routes, and starts the server.

---

## Setup Guide

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed.
   - Example:
     ```
     DB_URL=mongodb://localhost:27017/
     PORT=3000
     JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
     JWT_ACCESS_TOKEN_EXPIRATION=1h
     JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
     JWT_REFRESH_TOKEN_EXPIRATION=7d
     EMAIL_USER=testmail@gmail.com
     EMAIL_PASSWORD=your-app-specific-password
     NODE_ENV=development
     LOG_LEVEL=info
     ```

   - **Note:** For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833?hl=en) for `EMAIL_PASSWORD`.

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   - The API will be available at `http://localhost:3000/api/v1`.

### Frontend Setup

> **Note:** The frontend is not included in this repository. If you have a separate frontend (e.g., React, Vue), follow these steps:

1. **Clone or create your frontend project in a separate folder.**
2. **Update the frontend to use the backend API URL:**
   - Set the API base URL to match your backend (e.g., `http://localhost:3000/api/v1`).
   - If using environment variables, update `.env` in your frontend project:
     ```
     REACT_APP_API_URL=http://localhost:3000/api/v1
     ```
3. **Install frontend dependencies and start the frontend:**
   ```bash
   npm install
   npm start
   ```
4. **Ensure CORS is configured in the backend to allow your frontend origin.**
   - Update `WHITE_LIST_ORIGINS` in `src/config/index.ts` if needed.

---

## Environment Variables

- **DB_URL**: MongoDB connection string.
- **PORT**: Server port.
- **JWT_ACCESS_TOKEN_SECRET**: Secret for access tokens.
- **JWT_ACCESS_TOKEN_EXPIRATION**: Access token expiry (e.g., `1h`).
- **JWT_REFRESH_TOKEN_SECRET**: Secret for refresh tokens.
- **JWT_REFRESH_TOKEN_EXPIRATION**: Refresh token expiry (e.g., `7d`).
- **EMAIL_USER**: Gmail address for sending emails.
- **EMAIL_PASSWORD**: Gmail app password.
- **NODE_ENV**: `development` or `production`.
- **LOG_LEVEL**: Logging level (`info`, `warn`, `error`).

**How to update:**
- Edit `.env` and restart the backend server for changes to take effect.

---

## API Endpoints

- **Auth:** `/api/v1/auth/register`, `/login`, `/logout`, `/refresh-token`
- **User:** `/api/v1/user/me`, `/update`, `/change-password`, `/delete`, `/add`, `/all`, `/activate/:userId`, `/deactivate/:userId`
- **Books:** `/api/v1/books/`, `/category/:category`, `/name/:name`, `/books/:id`
- **Lending:** `/api/v1/lendings/lend`, `/return/:lendingId`, `/user/:email`, `/book/:name`, `/overdue`
- **Audit:** `/api/v1/audit/logs?range=today|week|month`
- **Email:** `/api/v1/email/send-reminder`
- **Dashboard:** `/api/v1/dashbord/`

---

## Troubleshooting

- **MongoDB not connecting:** Check `DB_URL` and ensure MongoDB is running.
- **Email not sending:** Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are correct and app password is used.
- **CORS errors:** Update `WHITE_LIST_ORIGINS` in config.
- **File upload issues:** Ensure `public/uploads/books` directory exists and is writable.

---

## License

This project is for educational purposes.

