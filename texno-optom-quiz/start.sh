#!/bin/bash
export PATH="$(pwd)/node-v20.13.1-darwin-arm64/bin:$PATH"

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Installing dependencies..."
npm install

echo "Starting Next.js..."
npm run dev
