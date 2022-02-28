import {MigrationInterface, QueryRunner} from "typeorm";

export class exchangesGithub1646037672750 implements MigrationInterface {
    name = 'exchangesGithub1646037672750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exchanges" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_c61bc9085110d0b5504738b385a" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "github" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_8da985c9ddf375a93e5741a433d" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "github"`);
        await queryRunner.query(`DROP TABLE "exchanges"`);
    }

}
