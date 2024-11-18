#!/bin/bash

set -e;
# check DB_USERNAME is set
if [ -z "${DB_USERNAME:-}" ]; then
    echo "SETUP ERROR: DB_USERNAME is not set!";
    exit 1;
fi
if [ -n "${DB_USERNAME:-}" ] && [ -n "${DB_PASSWORD:-}" ]; then
    echo "SETUP INFO: Creating user and database!";
	psql -v ON_ERROR_STOP=1 --username "$DB_USERNAME"  <<-EOSQL
		CREATE DATABASE ${DB_DATABASE};
		GRANT ALL PRIVILEGES ON DATABASE ${DB_DATABASE} TO ${DB_USERNAME};
	EOSQL
    psql -v ON_ERROR_STOP=1 --username "$IOT_DB_USERNAME"  <<-EOSQL
		CREATE DATABASE ${IOT_DB_DATABASE};
		GRANT ALL PRIVILEGES ON DATABASE ${IOT_DB_DATABASE} TO ${IOT_DB_USERNAME};
	EOSQL
else
	echo "SETUP INFO: No Environment variables given!"
fi
