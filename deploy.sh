#!/bin/bash

echo "🚀 Starting ProofMint Deployment..."
echo ""

# Stop any existing replica
echo "🛑 Stopping existing replica..."
dfx stop

# Start fresh replica
echo "▶️  Starting local Internet Computer replica..."
dfx start --clean --background

# Wait for replica to be ready
sleep 3

# Deploy backend first
echo ""
echo "📦 Deploying backend canister (idea_vault)..."
dfx deploy idea_vault

# Check if backend deployment succeeded
if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
else
    echo "❌ Backend deployment failed!"
    exit 1
fi

# MANUALLY GENERATE DECLARATIONS
echo ""
echo "🔧 Generating TypeScript/JavaScript declarations..."
dfx generate idea_vault

# Check that declarations were generated
echo ""
echo "🔍 Checking for generated declarations..."
if [ -d "creativevault-production/src/declarations/idea_vault" ]; then
    echo "✅ Declarations found!"
    ls -la creativevault-production/src/declarations/idea_vault/
else
    echo "❌ Declarations not found! Trying alternative path..."
    
    # Sometimes dfx generates in a different location
    if [ -d "src/declarations/idea_vault" ]; then
        echo "📁 Found declarations in src/declarations, moving them..."
        mkdir -p creativevault-production/src/declarations
        cp -r src/declarations/idea_vault creativevault-production/src/declarations/
        echo "✅ Declarations moved successfully!"
    else
        echo "❌ Could not find declarations anywhere!"
        echo "Checking all possible locations..."
        find . -type d -name "declarations" 2>/dev/null
        exit 1
    fi
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd creativevault-production
npm install

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Deploy frontend
cd ..
echo ""
echo "📦 Deploying frontend canister (creative_vault_frontend)..."
dfx deploy creative_vault_frontend

# Get canister IDs
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Canister Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend Canister ID: $(dfx canister id idea_vault)"
echo "Frontend Canister ID: $(dfx canister id creative_vault_frontend)"
echo ""
echo "🌐 Frontend URL:"
echo "http://127.0.0.1:4944/?canisterId=$(dfx canister id creative_vault_frontend)"
echo ""
echo "🔧 Candid Interface (Backend):"
echo "http://127.0.0.1:4944/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id idea_vault)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
