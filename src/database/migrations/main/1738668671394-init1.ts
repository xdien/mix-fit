import { MigrationInterface, QueryRunner } from "typeorm";

export class Init11738668671394 implements MigrationInterface {
    name = 'Init11738668671394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_telemetry" ADD "metric_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device_telemetry" DROP COLUMN "metric_name"`);
    }

}
