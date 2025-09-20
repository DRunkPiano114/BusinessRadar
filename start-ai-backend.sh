#!/bin/bash

# AI Backend Startup Script for BusinessRadar

echo "🚀 Starting AI Backend for BusinessRadar..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "ai-backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd ai-backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ai-backend/venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
cd ai-backend
pip install -r requirements.txt

# Check for environment file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp config.env.example .env
    echo "📝 Please edit .env file and add your GEMINI_API_KEY"
    echo "   You can get a free API key from: https://makersuite.google.com/app/apikey"
fi

# Start the backend server
echo "🌟 Starting AI Backend server..."
echo "   Backend will be available at: http://localhost:5000"
echo "   API Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
