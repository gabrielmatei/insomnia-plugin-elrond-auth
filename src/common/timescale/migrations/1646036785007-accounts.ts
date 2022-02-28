import {MigrationInterface, QueryRunner} from "typeorm";

export class accounts1646036785007 implements MigrationInterface {
    name = 'accounts1646036785007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts_delegation_legacy_active" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_c340264bd7216c6b315fec41fa8" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "accounts_total_balance_with_stake" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_0d7d965a8e9a9649b8f53df7f94" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "accounts_total_stake" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_f421dccf1d2fe0079309b54c6a4" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts_total_stake"`);
        await queryRunner.query(`DROP TABLE "accounts_total_balance_with_stake"`);
        await queryRunner.query(`DROP TABLE "accounts_delegation_legacy_active"`);
    }

}
