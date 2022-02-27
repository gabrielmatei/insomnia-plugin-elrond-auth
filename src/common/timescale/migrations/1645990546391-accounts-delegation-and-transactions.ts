import {MigrationInterface, QueryRunner} from "typeorm";

export class accountsDelegationAndTransactions1645990546391 implements MigrationInterface {
    name = 'accountsDelegationAndTransactions1645990546391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts_delegation" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_7a70f901de3bbcf0234d976a88a" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_7b206ce56e6cf54dcc6fdabab29" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "accounts_delegation"`);
    }

}
