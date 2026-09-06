import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePlayersCountCoulumnFromTeamsTable1788724801728 implements MigrationInterface {
    name = 'RemovePlayersCountCoulumnFromTeamsTable1788724801728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_tournament" DROP CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "playersCount"`);
        await queryRunner.query(`ALTER TABLE "category_tournament" ADD CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_tournament" DROP CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef"`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "playersCount" integer`);
        await queryRunner.query(`ALTER TABLE "category_tournament" ADD CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
