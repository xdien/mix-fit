#!/bin/bash
set -e

# Check if DB_USERNAME environment variable is set
if [ -z "${DB_USERNAME:-}" ]; then
    echo "SETUP ERROR: DB_USERNAME is not set!";
    exit 1;
fi

# Create users and databases
psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    -- Restrict postgres user to only local connections
    ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';
    
    -- Create main app user if not exists
    DO \$\$ 
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USERNAME}') THEN
            CREATE USER ${DB_USERNAME} WITH PASSWORD '${DB_PASSWORD}';
        END IF;
    END
    \$\$;
    
    -- Create database if not exists for main app
    SELECT 'CREATE DATABASE ${DB_DATABASE}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_DATABASE}')\gexec
    
    GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USERNAME};
    
    -- Grant schema permissions for main app database
    \c ${DB_DATABASE};
    GRANT ALL ON SCHEMA public TO ${DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${DB_USERNAME};
    
    -- Check if IOT user is different from main user
    DO \$\$ 
    BEGIN
        IF '${IOT_DB_USERNAME}' != '${DB_USERNAME}' THEN
            IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${IOT_DB_USERNAME}') THEN
                CREATE USER ${IOT_DB_USERNAME} WITH PASSWORD '${IOT_DB_PASSWORD}';
            END IF;
        END IF;
    END
    \$\$;
    
    -- Create database if not exists for IOT
    SELECT 'CREATE DATABASE ${IOT_DB_DATABASE}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${IOT_DB_DATABASE}')\gexec
    
    GRANT ALL PRIVILEGES ON DATABASE ${IOT_DB_DATABASE} TO ${IOT_DB_USERNAME};
    
    -- Grant schema permissions for IOT database
    \c ${IOT_DB_DATABASE};
    GRANT ALL ON SCHEMA public TO ${IOT_DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${IOT_DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${IOT_DB_USERNAME};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ${IOT_DB_USERNAME};
EOSQL

# Update pg_hba.conf to restrict access
cat > /var/lib/postgresql/data/pg_hba.conf <<EOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# Allow postgres user only from local connections
local   all            postgres                                peer
host    all            postgres         127.0.0.1/32           scram-sha-256
host    all            postgres         ::1/128                scram-sha-256

# Allow other users to connect from any host
host    all            all              0.0.0.0/0              scram-sha-256
host    all            all              ::/0                   scram-sha-256
EOF

# Ensure PostgreSQL listens on all addresses
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf

# Reload PostgreSQL configuration
psql -U postgres -c "SELECT pg_reload_conf();"

echo "SETUP INFO: Users, databases, and security configurations created successfully!"