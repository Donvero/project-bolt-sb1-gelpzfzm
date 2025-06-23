@echo off
echo SAMS(TM) Smart Audit Management System
echo =====================================
echo.

echo Navigating to project directory...
cd /d C:\Users\fanam\Downloads\project-bolt-sb1-gelpzfzm\project
echo.

echo Installing dependencies (this may take a few minutes)...
call npm install
echo.

echo Starting SAMS application...
echo Once started, access the application at: http://localhost:5173
echo Press Ctrl+C in this terminal window to stop the server
echo.

echo Launching server...
call npm run dev

echo Server has stopped.
pause
