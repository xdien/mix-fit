#!/bin/bash

# Script to fix Husky configuration for Mix-Fit platform
# Usage: ./scripts/fix-husky.sh

echo "Fixing Husky configuration..."

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "Yarn is not installed. Installing yarn globally..."
    npm install -g yarn
fi

# Restore proper Husky pre-commit hook (new format without deprecated lines)
echo "Updating .husky/pre-commit..."
cat > .husky/pre-commit << 'EOF'
yarn lint-staged
EOF

# Make pre-commit hook executable
chmod +x .husky/pre-commit

echo ""
echo "Husky configuration fixed successfully!"
echo ""
echo "Testing pre-commit hook..."
yarn lint-staged

echo ""
echo "If the test passed, Husky is now properly configured."
echo "Git commits will now automatically run linting and formatting."
