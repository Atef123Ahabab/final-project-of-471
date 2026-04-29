#!/bin/bash

# Resume & Job Portal API - Backend Setup Script

echo "=========================================="
echo "Resume & Job Portal API - Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js is installed: $(node -v)"

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Server will run on: http://localhost:1008"
echo ""
