import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init11737898418213 implements MigrationInterface {
  name = 'Init11737898418213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "device" ADD "online" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "online"`);
  }
}
