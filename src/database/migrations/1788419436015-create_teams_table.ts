import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTeamsTable1788419436015 implements MigrationInterface {
    name = 'CreateTeamsTable1788419436015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."teams_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "permalink" character varying NOT NULL, "image_url" character varying, "image_public_id" character varying, "format" character varying NOT NULL, "gender" "public"."teams_gender_enum" NOT NULL DEFAULT 'male', "country" character varying, "city" character varying, "state" character varying, "emails" character varying array NOT NULL DEFAULT '{}', "address" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "tournament_id" uuid, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9237ecd4dffe5c53a12cf3c51" ON "teams"  ("permalink", "format") `);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_85bce610ca3a492d9c23de8ad20" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_85bce610ca3a492d9c23de8ad20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9237ecd4dffe5c53a12cf3c51"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TYPE "public"."teams_gender_enum"`);
    }

}
