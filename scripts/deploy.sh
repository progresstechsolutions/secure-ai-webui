#!/bin/bash

# Secure AI WebUI Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting Secure AI WebUI deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.mjs" ]; then
    print_error "This doesn't appear to be a Next.js project directory"
    print_error "Please run this script from the project root"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

if [ $? -ne 0 ]; then
    print_warning "TypeScript errors found. Please fix them before deployment."
    print_warning "You can run 'npm run lint:fix' to automatically fix some issues."
    read -p "Continue with deployment anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled due to TypeScript errors"
        exit 1
    fi
fi

# Run linting
print_status "Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    print_warning "ESLint errors found. Please fix them before deployment."
    print_warning "You can run 'npm run lint:fix' to automatically fix some issues."
    read -p "Continue with deployment anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled due to ESLint errors"
        exit 1
    fi
fi

# Run build optimization
print_status "Running build optimization..."
npm run optimize

if [ $? -ne 0 ]; then
    print_error "Build optimization failed"
    exit 1
fi

# Build the project
print_status "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Build completed successfully"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed."
    print_status "Installing Vercel CLI..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI"
        print_status "Please install it manually: npm install -g vercel"
        exit 1
    fi
fi

print_success "Vercel CLI is available"

# Check if project is linked to Vercel
if [ ! -f ".vercel/project.json" ]; then
    print_status "Project not linked to Vercel. Please link it first:"
    echo "  vercel link"
    echo "  vercel env pull .env.local"
    echo ""
    print_status "After linking, run this script again."
    exit 1
fi

# Pull environment variables
print_status "Pulling environment variables from Vercel..."
vercel env pull .env.local

if [ $? -ne 0 ]; then
    print_warning "Failed to pull environment variables"
    print_status "Please check your Vercel project configuration"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    print_error "Deployment failed"
    exit 1
fi

print_success "Deployment completed successfully!"
print_status ""
print_status "Next steps:"
print_status "1. Verify your deployment at the provided URL"
print_status "2. Test all functionality (auth, uploads, chat, etc.)"
print_status "3. Check the deployment checklist in DEPLOYMENT_CHECKLIST.md"
print_status "4. Monitor your deployment in the Vercel dashboard"
print_status ""
print_status "For support, check:"
print_status "- PRODUCTION_SETUP.md"
print_status "- DEPLOYMENT_CHECKLIST.md"
print_status "- Vercel dashboard logs" 