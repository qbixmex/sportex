import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGalleryImageTable1788743764576 implements MigrationInterface {
    name = 'CreateGalleryImageTable1788743764576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gallery_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "image_url" character varying NOT NULL, "image_public_id" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "gallery_id" uuid NOT NULL, CONSTRAINT "UQ_e319906c4f9b7fad0ed14188dfe" UNIQUE ("image_url"), CONSTRAINT "PK_9b1601c4bdad7456bb12636dd10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gallery_images" ADD CONSTRAINT "FK_745f62470c59949a750e006fc87" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery_images" DROP CONSTRAINT "FK_745f62470c59949a750e006fc87"`);
        await queryRunner.query(`DROP TABLE "gallery_images"`);
    }

}
