import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTournamentTable1788388524631 implements MigrationInterface {
    name = 'CreateCategoryTournamentTable1788388524631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category_tournament" ("tournament_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_1b952de81f6282c167ec3b436e5" PRIMARY KEY ("tournament_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5c5123d1a5070d9decf3df049" ON "category_tournament"  ("tournament_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fa8b81c67dcdd1bda608f311ae" ON "category_tournament"  ("category_id") `);
        await queryRunner.query(`ALTER TABLE "category_tournament" ADD CONSTRAINT "FK_f5c5123d1a5070d9decf3df0496" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_tournament" ADD CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_tournament" DROP CONSTRAINT "FK_fa8b81c67dcdd1bda608f311aef"`);
        await queryRunner.query(`ALTER TABLE "category_tournament" DROP CONSTRAINT "FK_f5c5123d1a5070d9decf3df0496"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa8b81c67dcdd1bda608f311ae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5c5123d1a5070d9decf3df049"`);
        await queryRunner.query(`DROP TABLE "category_tournament"`);
    }

}
