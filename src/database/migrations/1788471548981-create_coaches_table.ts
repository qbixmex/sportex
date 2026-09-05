import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoachesModule1788471548981 implements MigrationInterface {
    name = 'AddCoachesModule1788471548981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coaches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "age" integer, "nationality" character varying, "image_url" character varying, "image_public_id" character varying, "description" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_769512c621f6d217ca32463e710" UNIQUE ("email"), CONSTRAINT "PK_eddaece1a1f1b197fa39e6864a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "coach_id" uuid`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_a1df838977d51a13cc483ba013f" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_a1df838977d51a13cc483ba013f"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "coach_id"`);
        await queryRunner.query(`DROP TABLE "coaches"`);
    }

}
