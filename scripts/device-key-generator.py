#!/usr/bin/python3

import base64
import os
import json
import datetime
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import hashes
from pathlib import Path
import click
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.syntax import Syntax

class KeyGenerator:
    def __init__(self, output_dir="keys"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.console = Console()

    def generate_key_pair(self, device_id):
        """Generate Ed25519 key pair for a device"""
        # Generate private key
        private_key = ed25519.Ed25519PrivateKey.generate()
        # Get public key
        public_key = private_key.public_key()

        # Get raw bytes
        private_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        public_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )

        # Create key info
        key_info = {
            "device_id": device_id,
            "algorithm": "Ed25519",
            "created_at": datetime.datetime.now().isoformat(),
            "private_key": {
                "raw": base64.b64encode(private_bytes).decode('utf-8'),
                "hex": private_bytes.hex(),
                "length": len(private_bytes)
            },
            "public_key": {
                "raw": base64.b64encode(public_bytes).decode('utf-8'),
                "hex": public_bytes.hex(),
                "length": len(public_bytes)
            }
        }

        # Generate C++ code
        cpp_code = self.generate_cpp_code(device_id, private_bytes, public_bytes)
        
        # Save keys and code
        self.save_keys(device_id, key_info, cpp_code)
        
        return key_info, cpp_code

    def generate_cpp_code(self, device_id, private_bytes, public_bytes):
        """Generate C++ code for ESP8266"""
        return f"""
// Auto-generated key pair for device: {device_id}
// Generated at: {datetime.datetime.now().isoformat()}
// WARNING: Keep the private key secret!
#ifndef DEVICE_CRYPTO_H
#define DEVICE_CRYPTO_H

#include <Arduino.h>
#include <Ed25519.h>

// Ed25519 Keys
const uint8_t PRIVATE_KEY[32] = {{{', '.join([str(b) for b in private_bytes])}}};
const uint8_t PUBLIC_KEY[32] = {{{', '.join([str(b) for b in public_bytes])}}};

class DeviceCrypto {{
private:
    uint8_t signature[64];
    // Device ID
    const char* DEVICE_ID = "{device_id}";

public:
    DeviceCrypto() {{
        // Keys are already initialized as constants
    }}

    static DeviceCrypto &getInstance()
    {
        static DeviceCrypto instance;
        return instance;
    }

    // Sign data using Ed25519
    void sign(const uint8_t* message, size_t messageLen) {{
        Ed25519::sign(signature, PRIVATE_KEY, PUBLIC_KEY, message, messageLen);
    }}

    // Get public key as Base64
    String getPublicKeyBase64() {{
        return base64Encode(PUBLIC_KEY, 32);
    }}

    // Get device ID
    const char* getDeviceId() {{
        return DEVICE_ID;
    }}

private:
    // Base64 encoding helper
    String base64Encode(const uint8_t* data, size_t length) {{
        static const char b64[] = 
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        String encoded;
        
        int i = 0;
        int j = 0;
        uint8_t char_array_3[3];
        uint8_t char_array_4[4];

        while (length--) {{
            char_array_3[i++] = *(data++);
            if (i == 3) {{
                char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
                char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + 
                                 ((char_array_3[1] & 0xf0) >> 4);
                char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + 
                                 ((char_array_3[2] & 0xc0) >> 6);
                char_array_4[3] = char_array_3[2] & 0x3f;

                for(i = 0; i < 4; i++)
                    encoded += b64[char_array_4[i]];
                i = 0;
            }}
        }}

        if (i) {{
            for(j = i; j < 3; j++)
                char_array_3[j] = '\\0';

            char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
            char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + 
                             ((char_array_3[1] & 0xf0) >> 4);
            char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + 
                             ((char_array_3[2] & 0xc0) >> 6);

            for (j = 0; j < i + 1; j++)
                encoded += b64[char_array_4[j]];

            while(i++ < 3)
                encoded += '=';
        }}

        return encoded;
    }}
}};
#endif
"""

    def save_keys(self, device_id, key_info, cpp_code):
        """Save generated keys and code to files"""
        device_dir = self.output_dir / device_id
        device_dir.mkdir(exist_ok=True)

        # Save key info as JSON
        with open(device_dir / "keys.json", "w") as f:
            json.dump(key_info, f, indent=2)

        # Save C++ code
        with open(device_dir / "crypto.h", "w") as f:
            f.write(cpp_code)

    def display_key_info(self, key_info):
        """Display key information in a formatted table"""
        # Create key info table
        table = Table(title=f"Key Information for Device: {key_info['device_id']}")
        
        table.add_column("Property", style="cyan")
        table.add_column("Value", style="green")

        table.add_row("Algorithm", key_info["algorithm"])
        table.add_row("Created At", key_info["created_at"])
        table.add_row("Private Key (Base64)", key_info["private_key"]["raw"])
        table.add_row("Private Key (HEX)", key_info["private_key"]["hex"])
        table.add_row("Private Key Length", str(key_info["private_key"]["length"]))
        table.add_row("Public Key (Base64)", key_info["public_key"]["raw"])
        table.add_row("Public Key (HEX)", key_info["public_key"]["hex"])
        table.add_row("Public Key Length", str(key_info["public_key"]["length"]))

        self.console.print(table)

    def display_cpp_code(self, cpp_code):
        """Display C++ code with syntax highlighting"""
        syntax = Syntax(cpp_code, "cpp", theme="monokai", line_numbers=True)
        self.console.print(Panel(syntax, title="Generated C++ Code", border_style="blue"))

@click.command()
@click.option('--device-id', prompt='Enter device ID', help='ID of the device')
@click.option('--output', default='keys', help='Output directory for keys')
def main(device_id, output):
    """Generate Ed25519 keys for ESP8266 devices"""
    generator = KeyGenerator(output)
    
    # Generate keys
    console = Console()
    with console.status("Generating keys...", spinner="dots"):
        key_info, cpp_code = generator.generate_key_pair(device_id)

    # Display results
    generator.display_key_info(key_info)
    generator.display_cpp_code(cpp_code)
    
    # Show save location
    console.print(f"\nFiles saved in: {Path(output) / device_id}", style="bold green")

if __name__ == '__main__':
    main()