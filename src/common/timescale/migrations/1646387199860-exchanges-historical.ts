import {MigrationInterface, QueryRunner} from "typeorm";

export class exchangesHistorical1646387199860 implements MigrationInterface {
    name = 'exchangesHistorical1646387199860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exchanges_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_9c799ba0452560bcaa5f73970d9" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchanges_historical"`);
    }

}
