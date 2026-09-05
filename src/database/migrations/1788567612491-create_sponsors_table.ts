import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSponsorTable1788567612491 implements MigrationInterface {
    name = 'CreateSponsorTable1788567612491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_7a1c9e8d7c9_field"`);
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_7a1c9e8d7c9_team"`);
        await queryRunner.query(`CREATE TABLE "sponsors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying, "imageUrl" character varying, "imagePublicId" character varying, "startDate" date, "endDate" date, "position" integer NOT NULL DEFAULT '0', "clicks" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_e0107b9d2bcde30242b06fdecab" UNIQUE ("name"), CONSTRAINT "PK_6d1114fe7e65855154351b66bfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "playersCount" integer`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_979ab083c48df35e2ea85baff3b" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_d72c51181e7330226f315db2799" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_d72c51181e7330226f315db2799"`);
        await queryRunner.query(`ALTER TABLE "field_team" DROP CONSTRAINT "FK_979ab083c48df35e2ea85baff3b"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "playersCount"`);
        await queryRunner.query(`DROP TABLE "sponsors"`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_7a1c9e8d7c9_team" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "field_team" ADD CONSTRAINT "FK_7a1c9e8d7c9_field" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
