@echo off
REM Secure AI WebUI Deployment Script for Windows
REM This script automates the deployment process to Vercel

echo 🚀 Starting Secure AI WebUI deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] This doesn't appear to be a Next.js project directory
    echo [ERROR] Please run this script from the project root
    pause
    exit /b 1
)

if not exist "next.config.mjs" (
    echo [ERROR] This doesn't appear to be a Next.js project directory
    echo [ERROR] Please run this script from the project root
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=2 delims=." %%i in ('node --version') do set NODE_VERSION=%%i
if %NODE_VERSION% LSS 18 (
    echo [ERROR] Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo [SUCCESS] Node.js version check passed:
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully

REM Run type checking
echo [INFO] Running TypeScript type checking...
call npm run type-check

if %errorlevel% neq 0 (
    echo [WARNING] TypeScript errors found. Please fix them before deployment.
    echo [WARNING] You can run 'npm run lint:fix' to automatically fix some issues.
    set /p CONTINUE="Continue with deployment anyway? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        echo [ERROR] Deployment cancelled due to TypeScript errors
        pause
        exit /b 1
    )
)

REM Run linting
echo [INFO] Running ESLint...
call npm run lint

if %errorlevel% neq 0 (
    echo [WARNING] ESLint errors found. Please fix them before deployment.
    echo [WARNING] You can run 'npm run lint:fix' to automatically fix some issues.
    set /p CONTINUE="Continue with deployment anyway? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        echo [ERROR] Deployment cancelled due to ESLint errors
        pause
        exit /b 1
    )
)

REM Run build optimization
echo [INFO] Running build optimization...
call npm run optimize

if %errorlevel% neq 0 (
    echo [ERROR] Build optimization failed
    pause
    exit /b 1
)

REM Build the project
echo [INFO] Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo [SUCCESS] Build completed successfully

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI is not installed.
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
    
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo [INFO] Please install it manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo [SUCCESS] Vercel CLI is available

REM Check if project is linked to Vercel
if not exist ".vercel\project.json" (
    echo [INFO] Project not linked to Vercel. Please link it first:
    echo   vercel link
    echo   vercel env pull .env.local
    echo.
    echo [INFO] After linking, run this script again.
    pause
    exit /b 1
)

REM Pull environment variables
echo [INFO] Pulling environment variables from Vercel...
call vercel env pull .env.local

if %errorlevel% neq 0 (
    echo [WARNING] Failed to pull environment variables
    echo [INFO] Please check your Vercel project configuration
)

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
call vercel --prod

if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] Deployment completed successfully!
echo.
echo [INFO] Next steps:
echo 1. Verify your deployment at the provided URL
echo 2. Test all functionality (auth, uploads, chat, etc.)
echo 3. Check the deployment checklist in DEPLOYMENT_CHECKLIST.md
echo 4. Monitor your deployment in the Vercel dashboard
echo.
echo [INFO] For support, check:
echo - PRODUCTION_SETUP.md
echo - DEPLOYMENT_CHECKLIST.md
echo - Vercel dashboard logs

pause 