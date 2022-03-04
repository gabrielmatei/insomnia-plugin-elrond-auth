import {MigrationInterface, QueryRunner} from "typeorm";

export class stakingHistorical1646383376968 implements MigrationInterface {
    name = 'stakingHistorical1646383376968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staking_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f3dc77cbe5ac044e37c18b34511" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staking_historical"`);
    }

}
