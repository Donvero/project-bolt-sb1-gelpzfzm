# SAMS Application Troubleshooting Guide

## Issue: Blank Screen on Application Launch

If you're seeing a blank white screen when accessing the application, try these troubleshooting steps:

### Step 1: Check for Console Errors
1. Right-click on the blank page
2. Select "Inspect" or "Inspect Element" 
3. Go to the "Console" tab
4. Look for any error messages (they're usually in red)
5. Note these errors for debugging

### Step 2: Restart the Development Server
```bash
# Press Ctrl+C in the terminal where the server is running to stop it
# Then restart with:
npm run dev
```

### Step 3: Clear Browser Cache
1. Press Ctrl+Shift+Delete in your browser
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

### Step 4: Try a Different Browser
- If using Chrome, try Firefox or Edge
- This helps determine if it's a browser-specific issue

### Step 5: Verify Login Credentials
Use these credentials for testing:
- admin@municipality.gov.za / admin123
- auditor@municipality.gov.za / auditor123
- manager@municipality.gov.za / manager123
- clerk@municipality.gov.za / clerk123

### Step 6: Install Missing Dependencies
```bash
npm install react-router-dom @mui/material @mui/icons-material zustand react-hook-form react-hot-toast
```

### Step 7: Fix Potential Configuration Issues
If the problem persists, you can try creating a `.env` file in the project root with:
```
VITE_API_URL=http://localhost:3002
```

### Step 8: Direct Access to Pages
Try accessing specific routes directly to bypass potential routing issues:
- http://localhost:3002/login
- http://localhost:3002/dashboard

## Key Routes in the Application:

- `/login` - Authentication page
- `/dashboard` - Main dashboard
- `/compliance` - Compliance monitoring (new in Milestone 2)
- `/alerts` - Alerts and notifications (new in Milestone 2)
- `/budget` - Budget management
- `/procurement` - Procurement management
- `/reports` - Reporting system
- `/users` - User management (admin only)
- `/settings` - System settings
