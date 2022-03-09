import { MigrationInterface, QueryRunner } from "typeorm";

export class transactionsHistorical1646842211277 implements MigrationInterface {
    name = 'transactionsHistorical1646842211277';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions_historical_backup" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_ae9c1c8b3112d5236e073fed1fe" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "transactions_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_3e649b55a26d0cdbf3d0d3d59f2" PRIMARY KEY ("id", "timestamp"))`);

        await queryRunner.query(`SELECT create_hypertable('transactions_historical', 'timestamp')`);
        await queryRunner.query(`SELECT create_hypertable('transactions_historical_backup', 'timestamp')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions_historical"`);
        await queryRunner.query(`DROP TABLE "transactions_historical_backup"`);
    }

}
