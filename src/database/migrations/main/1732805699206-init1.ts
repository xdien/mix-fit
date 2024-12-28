import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Init11732805699206 implements MigrationInterface {
  name = 'Init11732805699206';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device_commands" ("command_id" character varying NOT NULL, "command" character varying NOT NULL, CONSTRAINT "PK_af4492046bfb9c6de03b314a773" PRIMARY KEY ("command_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_types" ("device_type_id" character varying NOT NULL, CONSTRAINT "PK_2d7fd9719c77f0c85c937bb5f62" PRIMARY KEY ("device_type_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "device_id" character varying NOT NULL, "name" character varying, "description" character varying, "model" character varying, "owner_id" uuid, "device_type_device_type_id" character varying, CONSTRAINT "PK_17d554d4f6b44ff0e200ee4b920" PRIMARY KEY ("device_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_translations_language_code_enum" AS ENUM('en_US', 'ru_RU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "language_code" "public"."post_translations_language_code_enum" NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_977f23a9a89bf4a1a9e2e29c136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'IOT_ADMIN', 'USER', 'GUEST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" character varying, "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{USER}', "email" character varying, "password" character varying, "phone" character varying, "avatar" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."device_telemetry_value_type_enum" AS ENUM('numeric', 'text', 'media', 'binary')`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_telemetry" ("device_telemetry_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" character varying NOT NULL, "metadata" jsonb DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "value_type" "public"."device_telemetry_value_type_enum" NOT NULL, "numeric_value" numeric(10,2), "text_value" character varying, "media_url" character varying, "binary_value" boolean, CONSTRAINT "PK_7fc98d2ddc0b6e4b356625261a6" PRIMARY KEY ("device_telemetry_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64b7753e53da4770c4a9089a38" ON "device_telemetry" ("device_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."command_logs_status_enum" AS ENUM('PENDING', 'SENT', 'DELIVERED', 'EXECUTED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "command_logs" ("device_command_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "device_id" character varying NOT NULL, "status" "public"."command_logs_status_enum" NOT NULL DEFAULT 'PENDING', "device_type" character varying NOT NULL, "payload" jsonb NOT NULL, "executed_at" TIMESTAMP, "error_message" character varying, "result" jsonb, "sent_at" TIMESTAMP, CONSTRAINT "PK_b9f0772d62a03c394e2d9199dcd" PRIMARY KEY ("device_command_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_8690bc91e4e5daf29493dcb9ce9" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_9333f64fab9c41ec731e30a55c8" FOREIGN KEY ("device_type_device_type_id") REFERENCES "device_types"("device_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" ADD CONSTRAINT "FK_11f143c8b50a9ff60340edca475" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" DROP CONSTRAINT "FK_11f143c8b50a9ff60340edca475"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_9333f64fab9c41ec731e30a55c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_8690bc91e4e5daf29493dcb9ce9"`,
    );
    await queryRunner.query(`DROP TABLE "command_logs"`);
    await queryRunner.query(`DROP TYPE "public"."command_logs_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64b7753e53da4770c4a9089a38"`,
    );
    await queryRunner.query(`DROP TABLE "device_telemetry"`);
    await queryRunner.query(
      `DROP TYPE "public"."device_telemetry_value_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "post_translations"`);
    await queryRunner.query(
      `DROP TYPE "public"."post_translations_language_code_enum"`,
    );
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "device_types"`);
    await queryRunner.query(`DROP TABLE "device_commands"`);
  }
}
