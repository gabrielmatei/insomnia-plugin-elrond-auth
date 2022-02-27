import { MigrationInterface, QueryRunner } from "typeorm";

export class accountsCount1645983165594 implements MigrationInterface {
    name = 'accountsCount1645983165594';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts_count" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_abc5257a9fd72aaaf67c6a19f9e" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts_count"`);
    }
}
