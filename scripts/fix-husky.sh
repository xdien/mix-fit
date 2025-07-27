#!/bin/bash

# Script to fix Husky configuration for Mix-Fit platform
# Usage: ./scripts/fix-husky.sh

echo "Fixing Husky configuration..."

# Remove deprecated Husky setup from pre-commit hook
echo "Updating .husky/pre-commit..."
echo "npx lint-staged" > .husky/pre-commit

# Make pre-commit hook executable
chmod +x .husky/pre-commit

# Ensure hook is executable
echo "Making pre-commit hook executable..."

echo ""
echo "Husky configuration fixed successfully!"
echo ""
echo "Testing pre-commit hook..."
npx lint-staged

echo ""
echo "If the test passed, Husky is now properly configured."
echo "Git commits will now automatically run linting and formatting."