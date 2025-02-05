import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init11738766557023 implements MigrationInterface {
  name = 'Init11738766557023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" ADD "device_type" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" DROP COLUMN "device_type"`,
    );
  }
}
