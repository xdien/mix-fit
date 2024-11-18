import { execSync } from 'child_process';
import * as path from 'path';

const args = process.argv.slice(2);
const dataSource = args[0];
const migrationName = args[1];

if (!dataSource || !migrationName) {
  console.error(
    'Usage: ts-node scripts/generate-migration.ts <dataSource> <migrationName>',
  );
  process.exit(1);
}

// Xây dựng đường dẫn migration
// const migrationPath = path.join(
//   'home',
//   'xdien',
//   'workspace',
//   'mixx-mash',
//   'src',
//   'database',
//   'migrations',
//   dataSource,
//   migrationName,
// );
// get current file execution path
const pwd = () => path.resolve(process.cwd());
// show current path
console.log('Current path:', pwd());

// Xây dựng command
const command = `typeorm migration:generate /home/xdien/workspace/mixx-mash/src/database/migrations/iot/CreateDeviceTelemetry -d ./ormconfig.ts ${
  dataSource !== 'default' ? `--dataSource ${dataSource}` : ''
}`;

console.log('Executing command:', command);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error during migration generation:', error);
  process.exit(1);
}
