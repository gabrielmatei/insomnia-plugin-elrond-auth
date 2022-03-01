import {MigrationInterface, QueryRunner} from "typeorm";

export class transactionsDetailed1646164899124 implements MigrationInterface {
    name = 'transactionsDetailed1646164899124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions_detailed" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_35b03a749d381a67e13aafd0b88" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions_detailed"`);
    }

}
