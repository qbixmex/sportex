import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTeamsTable1788421132250 implements MigrationInterface {
    name = 'UpdateTeamsTable1788421132250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_086f833532ccfe553e986c85f53" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_086f833532ccfe553e986c85f53"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "category_id"`);
    }

}
