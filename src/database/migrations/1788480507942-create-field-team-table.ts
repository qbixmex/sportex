import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFieldTeamTable1788480507942 implements MigrationInterface {
    name = 'CreateFieldTeamTable1788480507942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fields" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "permalink" character varying, "city" character varying, "state" character varying, "country" character varying, "address" character varying, "map" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_7a1c9e8d7c9_permalink" UNIQUE ("permalink"), CONSTRAINT "PK_7a1c9e8d7c9_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "field_team" ("field_id" uuid NOT NULL, "team_id" uuid NOT NULL, CONSTRAINT "PK_7a1c9e8d7c9_field_team" PRIMARY KEY ("field_id", "team_id"))`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_7a1c9e8d7c9_field" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_7a1c9e8d7c9_team" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_7a1c9e8d7c9_team"`);
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_7a1c9e8d7c9_field"`);
        await queryRunner.query(`DROP TABLE "field_team"`);
        await queryRunner.query(`DROP TABLE "fields"`);
    }

}
