import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGalleriesTable1788738178083 implements MigrationInterface {
    name = 'CreateGalleriesTable1788738178083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "galleries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "permalink" character varying NOT NULL, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_b47b47195a4e42cd939b433a6fe" UNIQUE ("permalink"), CONSTRAINT "PK_86b77299615c92db3d68c9c7919" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "galleries"`);
    }

}
