#!/bin/bash

echo "⚙️ Setting up CreativeVault development environment..."

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v dfx &> /dev/null; then
    echo "📥 Installing DFX..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ manually."
    exit 1
fi

echo "📦 Installing npm dependencies..."
npm install

echo "🔧 Setting up Git hooks..."
if [ -d .git ]; then
    echo "#!/bin/bash
npm run lint:fix
npm run format" > .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
fi

echo "📊 Generating initial declarations..."
if dfx ping local &> /dev/null; then
    dfx generate idea_vault
else
    echo "⚠️ Local IC replica not running. Start it with 'dfx start --background'"
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 Quick start commands:"
echo "  dfx start --background    # Start local IC replica"
echo "  npm start                 # Start development server"
echo "  ./scripts/deploy.sh       # Deploy locally"
echo ""
echo "📚 Documentation:"
echo "  docs/                     # Project documentation"
echo "  README.md                 # Getting started guide"
