import { MigrationInterface, QueryRunner } from "typeorm";

export class renameTrendsIngest1646304235840 implements MigrationInterface {
    name = 'renameTrendsIngest1646304235840';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trends" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f87d3829b8e6ddfbe04ab828ea7" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trends"`);
    }

}
