#!/bin/bash

# Quick Start Script for Admin Dashboard
# This script helps you start both backend and frontend quickly

echo "=========================================="
echo "  Insurance CRC Admin Dashboard"
echo "  Quick Start Script"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null
then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Python and Node.js detected"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
cd server

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../client

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""

echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd server/src"
echo "   uvicorn main:app --reload"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd client"
echo "   npm start"
echo ""
echo "Then visit: http://localhost:3000/admin"
echo ""
