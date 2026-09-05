import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTournamentsTable1788032636444 implements MigrationInterface {
    name = 'CreateTournamentsTable1788032636444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournaments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "permalink" character varying(200) NOT NULL, "image_url" character varying, "image_public_id" character varying, "description" character varying, "stage" character varying NOT NULL DEFAULT 'regular', "country" character varying, "state" character varying, "city" character varying, "season" character varying, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_70176f8af53e9c1c43887a10614" UNIQUE ("permalink"), CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tournaments"`);
    }
}
