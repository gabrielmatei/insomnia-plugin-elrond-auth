import { MigrationInterface, QueryRunner } from "typeorm";

export class quotesHistorical1646831422930 implements MigrationInterface {
    name = 'quotesHistorical1646831422930';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quotes_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f8786d36404b637df19ba3f582c" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`SELECT create_hypertable('quotes_historical', 'timestamp')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "quotes_historical"`);
    }

}
