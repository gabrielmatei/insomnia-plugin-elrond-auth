import {MigrationInterface, QueryRunner} from "typeorm";

export class accountsHistorical1646386827948 implements MigrationInterface {
    name = 'accountsHistorical1646386827948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "accounts_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_1007506a5fb139807df711d8379" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts_historical"`);
    }

}
