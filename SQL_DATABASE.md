# Database migration

## Migration from sql file

- Remove all `\r` from the sql file

```bash
sed -i 's/\r//g' src/database/sql/iot/mix-mash.sql
```

- Run the sql file

```bash
yarn migration:query "$(cat src/database/sql/iot/mix-mash.sql)"
```
