#!/bin/bash

echo "🚀 Deploying Voice Command Shopping Assistant..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Dist directory not found!"
    exit 1
fi

# Copy server files to dist
echo "🔧 Setting up server..."
mkdir -p dist/server
cp server/index.js dist/server/
cp package.json dist/

# Install production dependencies
echo "📥 Installing production dependencies..."
cd dist
npm install --production

echo "🎉 Deployment ready!"
echo "📱 To run the application:"
echo "   cd dist"
echo "   npm start"
echo ""
echo "🌐 Open http://localhost:3001 in your browser"
echo "🔊 Voice recognition ready for shopping commands!"
