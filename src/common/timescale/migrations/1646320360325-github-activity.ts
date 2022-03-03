import {MigrationInterface, QueryRunner} from "typeorm";

export class githubActivity1646320360325 implements MigrationInterface {
    name = 'githubActivity1646320360325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "github-activity" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_895bdeef9b02870c257ef0ab753" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "github-activity"`);
    }

}
