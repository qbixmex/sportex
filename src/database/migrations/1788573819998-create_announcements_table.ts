import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnnouncementsTable1788573819998 implements MigrationInterface {
    name = 'CreateAnnouncementsTable1788573819998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "announcements" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "permalink" character varying NOT NULL,
                "publishedAt" TIMESTAMP WITH TIME ZONE,
                "imageUrl" character varying,
                "imagePublicId" character varying,
                "description" text,
                "content" text NOT NULL,
                "active" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                CONSTRAINT "UQ_207ab1d12e321456643ad50d795" UNIQUE ("permalink"),
                CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "announcements"
        `);
    }

}
