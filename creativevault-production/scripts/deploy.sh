#!/bin/bash

echo "🚀 Deploying CreativeVault to Internet Computer..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX not found. Please install DFX first."
    echo "Installation: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Starting local IC replica..."
dfx start --clean --background

echo "🏗️ Building and deploying canisters..."
dfx deploy

echo "📊 Generating declarations..."
dfx generate

echo "🌐 Building frontend..."
npm run build

echo "✅ CreativeVault deployed successfully!"
echo ""
echo "🔗 Access your application:"
echo "Frontend: http://localhost:4943/?canisterId=$(dfx canister id creative_vault_frontend)"
echo "Backend Canister ID: $(dfx canister id idea_vault)"
echo ""
echo "📝 Next steps:"
echo "1. Open the frontend URL in your browser"
echo "2. Connect with Internet Identity"
echo "3. Start protecting your creative ideas!"
