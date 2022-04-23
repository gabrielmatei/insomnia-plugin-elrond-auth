import { MigrationInterface, QueryRunner } from "typeorm";

export class tradingInfo1649837537756 implements MigrationInterface {
    name = 'tradingInfo1649837537756';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trading_info" ("id" BIGSERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "identifier" character varying NOT NULL, "firstToken" character varying NOT NULL, "secondToken" character varying NOT NULL, "price" double precision NOT NULL, "volume" double precision NOT NULL, "fee" double precision NOT NULL, CONSTRAINT "UQ_ca44a7b41f9528d209b652d69c3" UNIQUE ("identifier"), CONSTRAINT "PK_1989a1bf7435c22d06e569676ee" PRIMARY KEY ("id", "timestamp"))`);

        // await queryRunner.query(`SELECT create_hypertable('trading_info', 'timestamp')`); // TODO
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trading_info"`);
    }

}
