#!/bin/bash

echo "🌐 Deploying CreativeVault to IC Testnet..."

# Confirm deployment
read -p "⚠️  Deploy to IC testnet? This will use testnet cycles. (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building for production..."
npm run build

echo "🚀 Deploying to IC testnet..."
dfx deploy --network testnet --with-cycles 2000000000000

echo "📊 Generating declarations for IC..."
dfx generate --network testnet

echo "✅ CreativeVault deployed to IC testnet!"
echo ""
echo "🔗 Your application is live at:"
echo "https://$(dfx canister id creative_vault_frontend --network testnet).ic0.app"
echo ""
echo "🎉 Congratulations! Your CreativeVault is now running on the Internet Computer Testnet!"