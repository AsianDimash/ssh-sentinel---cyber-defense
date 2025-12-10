<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SSH Sentinel - Cyber Defense Platform

This is a cyber defense dashboard application with a React frontend and a Node.js/SQLite backend.

## Features
- Real-time Log Monitoring
- Incident Management
- IP Blocking/Unblocking
- Dashboard Statistics

## Prerequisites
- Node.js

## Setup & Run

1. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   node index.js
   ```
   The server will run on `http://localhost:3001`.

3. **Start the Frontend Application**
   Open a new terminal:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Default Login
- **Username:** admin
- **Password:** password
