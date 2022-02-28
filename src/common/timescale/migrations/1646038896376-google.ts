import {MigrationInterface, QueryRunner} from "typeorm";

export class google1646038896376 implements MigrationInterface {
    name = 'google1646038896376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "google_trends" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_e2f24ad5e116f9c929b3183ee26" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "google" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_92944d71177b14b0bc7566a9b00" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "google"`);
        await queryRunner.query(`DROP TABLE "google_trends"`);
    }

}
