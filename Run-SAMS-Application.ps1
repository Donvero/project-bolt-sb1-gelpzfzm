# Run-SAMS-Application.ps1
# PowerShell script to run the SAMS™ Smart Audit Management System

# Display header
Write-Host "SAMS™ Smart Audit Management System" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Starting application setup..." -ForegroundColor Yellow

# Navigate to project directory
Write-Host "Navigating to project directory..." -ForegroundColor White
Set-Location -Path "C:\Users\fanam\Downloads\project-bolt-sb1-gelpzfzm\project"
Write-Host "✓ Successfully navigated to project directory" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} 
catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} 
catch {
    Write-Host "✗ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} 
catch {
    Write-Host "✗ Error installing dependencies" -ForegroundColor Red
    Write-Host "Trying to fix potential dependency issues..." -ForegroundColor Yellow
    npm audit fix
    Write-Host "Please run the script again if issues were fixed" -ForegroundColor Yellow
    exit 1
}

# Performance optimization tips
Write-Host "`nPerformance Optimization Tips:" -ForegroundColor Magenta
Write-Host "• Close unnecessary applications before running the app" -ForegroundColor White
Write-Host "• Ensure your browser has hardware acceleration enabled" -ForegroundColor White
Write-Host "• Use Microsoft Edge or Google Chrome for best performance" -ForegroundColor White
Write-Host "• If the app runs slowly, try reducing browser extensions" -ForegroundColor White

# Start the application
Write-Host "`nStarting SAMS™ application..." -ForegroundColor Yellow
Write-Host "Once started, access the application at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C in this terminal window to stop the server" -ForegroundColor Cyan
Write-Host "`nLaunching server..." -ForegroundColor Green

# Start the development server
npm run dev

# This line will only execute if npm run dev exits
Write-Host "Server has stopped." -ForegroundColor Yellow
