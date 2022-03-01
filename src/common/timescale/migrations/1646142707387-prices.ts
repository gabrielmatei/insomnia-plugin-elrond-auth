import {MigrationInterface, QueryRunner} from "typeorm";

export class prices1646142707387 implements MigrationInterface {
    name = 'prices1646142707387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prices" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_77b6266548d6e1f03badacf1b9f" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "prices"`);
    }

}
