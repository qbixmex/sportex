import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlayersTable1788466350121 implements MigrationInterface {
    name = 'CreatePlayersTable1788466350121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "players" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, "phone" character varying, "birthday" date, "nationality" character varying, "image_url" character varying, "image_public_id" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "team_id" uuid, CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_ce457a554d63e92f4627d6c5763" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_ce457a554d63e92f4627d6c5763"`);
        await queryRunner.query(`DROP TABLE "players"`);
    }

}
