# PowerShell script to generate JWT RSA keys for Mix-Fit platform
# Usage: .\scripts\generate-jwt-keys.ps1

Write-Host "Generating JWT RSA Keys for Mix-Fit Platform..." -ForegroundColor Green

# Check for OpenSSL
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
    Write-Host "OpenSSL not found!" -ForegroundColor Red
    Write-Host "Please download and install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    exit 1
}

# Create keys directory if it doesn't exist
if (-not (Test-Path "keys")) {
    New-Item -ItemType Directory -Path "keys" | Out-Null
}

# Generate RSA private key
Write-Host "Creating RSA private key (2048 bits)..." -ForegroundColor Blue
openssl genpkey -algorithm RSA -out keys/jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key from private key
Write-Host "Creating RSA public key..." -ForegroundColor Blue
openssl rsa -pubout -in keys/jwt_private_key.pem -out keys/jwt_public_key.pem

Write-Host ""
Write-Host "Keys generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Write-Host "   - keys/jwt_private_key.pem"
Write-Host "   - keys/jwt_public_key.pem"
Write-Host ""
Write-Host "To update .env file:" -ForegroundColor Yellow
Write-Host ""

# Display private key with correct format
Write-Host "Private Key:" -ForegroundColor Magenta
$privateKey = (Get-Content .\keys\jwt_private_key.pem -Raw) -replace "`r`n","\n"
Write-Host "JWT_PRIVATE_KEY=$privateKey" -ForegroundColor White

Write-Host ""

# Display public key with correct format
Write-Host "Public Key:" -ForegroundColor Magenta
$publicKey = (Get-Content .\keys\jwt_public_key.pem -Raw) -replace "`r`n","\n"
Write-Host "JWT_PUBLIC_KEY=$publicKey" -ForegroundColor White

Write-Host ""
Write-Host "Note: Copy the content above to your .env file" -ForegroundColor Yellow
Write-Host "Warning: Do not commit private key to git!" -ForegroundColor Red
Write-Host ""
Write-Host "To remove keys after copying:" -ForegroundColor Cyan
Write-Host "   Remove-Item -Recurse -Force keys\"