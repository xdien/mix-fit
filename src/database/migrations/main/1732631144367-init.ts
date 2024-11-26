import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1732631144367 implements MigrationInterface {
    name = 'Init1732631144367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "full_name" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'IOT_ADMIN', 'USER', 'GUEST')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'IOT_ADMIN', 'USER', 'GUEST')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'GUEST'`);
    }

}
