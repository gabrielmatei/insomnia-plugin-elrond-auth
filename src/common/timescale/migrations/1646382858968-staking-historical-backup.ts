import {MigrationInterface, QueryRunner} from "typeorm";

export class stakingHistoricalBackup1646382858968 implements MigrationInterface {
    name = 'stakingHistoricalBackup1646382858968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staking_historical_backup" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_5e7933ecf9963bc2c089602eb76" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staking_historical_backup"`);
    }

}
