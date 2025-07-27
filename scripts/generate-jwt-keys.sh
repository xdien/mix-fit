#!/bin/bash

# Script to generate JWT RSA keys for Mix-Fit platform
# Usage: ./scripts/generate-jwt-keys.sh

echo "Generating JWT RSA Keys for Mix-Fit Platform..."

# Create keys directory if it doesn't exist
mkdir -p keys

# Generate RSA private key
echo "Creating RSA private key (2048 bits)..."
openssl genpkey -algorithm RSA -out keys/jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private key
echo "Creating RSA public key..."
openssl rsa -pubout -in keys/jwt_private_key.pem -out keys/jwt_public_key.pem

echo ""
echo "Keys generated successfully!"
echo ""
echo "Generated files:"
echo "   - keys/jwt_private_key.pem"
echo "   - keys/jwt_public_key.pem"
echo ""
echo "To update .env file:"
echo ""
echo "Private Key:"
echo "JWT_PRIVATE_KEY=\"$(cat keys/jwt_private_key.pem | tr '\n' '\\n')\""
echo ""
echo "Public Key:"
echo "JWT_PUBLIC_KEY=\"$(cat keys/jwt_public_key.pem | tr '\n' '\\n')\""
echo ""
echo "Note: Copy the content above to your .env file"
echo "Warning: Do not commit private key to git!"
echo ""
echo "To remove keys after copying:"
echo "   rm -rf keys/"
