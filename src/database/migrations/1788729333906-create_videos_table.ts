import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVideosTable1788729333906 implements MigrationInterface {
    name = 'CreateVideosTable1788729333906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "videos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "permalink" character varying NOT NULL, "published_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "description" character varying, "url" character varying NOT NULL, "platform" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_6e826da7a63ee007f6336635dd4" UNIQUE ("permalink"), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "videos"`);
    }

}
