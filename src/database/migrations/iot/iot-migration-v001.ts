import fs from 'node:fs/promises';

import type { MigrationInterface, QueryRunner } from 'typeorm';

export class IotMigration1722948641071 implements MigrationInterface {
  name?: 'iot_migration_v001';

  transaction?: true;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // get current directory
    const currentDir = process.cwd();
    const queries = await fs.readFile(
      currentDir + '/src/database/migrations/iot/mix-mash.sql',
      {
        encoding: 'utf8',
      },
    );
    await queryRunner.query(queries);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // eslint-disable-next-line no-console
    void queryRunner.query('');
  }
}
