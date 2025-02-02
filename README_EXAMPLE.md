# Setup for development

## Install openssl

### Windows

Download and install from [here](https://slproweb.com/products/Win32OpenSSL.html)

- Go to the C:\Program Files\OpenSSL-Win64 folder double click on the start.bat file

```bash
openssl genpkey -algorithm RSA -out jwt_private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in jwt_private_key.pem -out jwt_public_key.pem
```

- Copy content

```bash
(Get-Content .\jwt_private_key.pem -Raw) -replace "`r`n","\n"
(Get-Content .\jwt_public_key.pem -Raw) -replace "`r`n","\n"
```

- Paste content in .env file

- Manually install husky

```bash
yarn add husky --dev
```

## Copy .env.example to .env

```bash
cp .env.example .env
```

## Copy .mosquitto_passwd_example to .mosquitto_passwd

```bash
# Linux
cp mosquitto/config/.mosquitto_passwd_example mosquitto/config/.mosquitto_passwd
# Windows
copy mosquitto\\config\\.mosquitto_passwd_example mosquitto\\config\\.mosquitto_passwd

```
