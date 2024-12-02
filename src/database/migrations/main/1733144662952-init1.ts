import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init11733144662952 implements MigrationInterface {
  name = 'Init11733144662952';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "measurement_units" ("measurement_unit_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "symbol" character varying, CONSTRAINT "PK_ba370d312aef9edea3772ec5692" PRIMARY KEY ("measurement_unit_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sensors" ("sensor_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "type" character varying, "location_id" character varying, "metadata" jsonb DEFAULT '{}', "measurement_unit_measurement_unit_id" uuid, CONSTRAINT "PK_c91753b089e1874c28c7fd409d2" PRIMARY KEY ("sensor_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" ADD "sensor_sensor_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensors" ADD CONSTRAINT "FK_5d3f084bf0092d19496ef222fbd" FOREIGN KEY ("measurement_unit_measurement_unit_id") REFERENCES "measurement_units"("measurement_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" ADD CONSTRAINT "FK_d9ea26ecede1006a9ce27c77cea" FOREIGN KEY ("sensor_sensor_id") REFERENCES "sensors"("sensor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" DROP CONSTRAINT "FK_d9ea26ecede1006a9ce27c77cea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sensors" DROP CONSTRAINT "FK_5d3f084bf0092d19496ef222fbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_telemetry" DROP COLUMN "sensor_sensor_id"`,
    );
    await queryRunner.query(`DROP TABLE "sensors"`);
    await queryRunner.query(`DROP TABLE "measurement_units"`);
  }
}
