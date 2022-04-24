import { MigrationInterface, QueryRunner } from "typeorm";

export class tradingInfo1650788144046 implements MigrationInterface {
    name = 'tradingInfo1650788144046';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trading_info" ("id" BIGSERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "identifier" character varying NOT NULL, "firstToken" character varying NOT NULL, "secondToken" character varying NOT NULL, "price" double precision NOT NULL, "volume" double precision NOT NULL, "fee" double precision NOT NULL, CONSTRAINT "UQ_ID" UNIQUE ("timestamp", "identifier", "firstToken", "secondToken"), CONSTRAINT "PK_11e8f1165eb2f78dc07d809ab01" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`SELECT create_hypertable('trading_info', 'timestamp')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trading_info"`);
    }
}
