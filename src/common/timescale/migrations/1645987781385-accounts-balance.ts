import {MigrationInterface, QueryRunner} from "typeorm";

export class accountsBalance1645987781385 implements MigrationInterface {
    name = 'accountsBalance1645987781385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts_balance" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_b14a7e5c2fe7a6c43a9ce8fd71c" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts_balance"`);
    }

}
