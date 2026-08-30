import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToNameToTournamentsTable1788124442085 implements MigrationInterface {
    name = 'AddUniqueToNameToTournamentsTable1788124442085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" ADD CONSTRAINT "UQ_b63b048f5871d7f48cdb4d4de1a" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournaments" DROP CONSTRAINT "UQ_b63b048f5871d7f48cdb4d4de1a"`);
    }

}
