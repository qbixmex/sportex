import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRolesColumnToUsersTable1788155244388 implements MigrationInterface {
    name = 'AddRolesColumnToUsersTable1788155244388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "roles" character varying array NOT NULL DEFAULT '{user}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roles"`);
    }

}
