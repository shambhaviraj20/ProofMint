#!/bin/bash

echo "🌐 Deploying CreativeVault to IC Mainnet..."

# Confirm deployment
read -p "⚠️  Deploy to IC mainnet? This will use real cycles. (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building for production..."
npm run build

echo "🚀 Deploying to IC mainnet..."
dfx deploy --network ic --with-cycles 2000000000000

echo "📊 Generating declarations for IC..."
dfx generate --network ic

echo "✅ CreativeVault deployed to IC mainnet!"
echo ""
echo "🔗 Your application is live at:"
echo "https://$(dfx canister id creative_vault_frontend --network ic).ic0.app"
echo ""
echo "🎉 Congratulations! Your CreativeVault is now running on the Internet Computer!"
