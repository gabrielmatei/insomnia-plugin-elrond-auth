import {MigrationInterface, QueryRunner} from "typeorm";

export class twitterQuotes1646047338426 implements MigrationInterface {
    name = 'twitterQuotes1646047338426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quotes" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_adc26ff6ab80ef590cc14c8ea3a" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "twitter" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_80ab6df6a5fd39dfed583ec8eea" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "twitter"`);
        await queryRunner.query(`DROP TABLE "quotes"`);
    }

}
