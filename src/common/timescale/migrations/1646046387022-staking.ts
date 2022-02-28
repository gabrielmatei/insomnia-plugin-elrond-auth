import {MigrationInterface, QueryRunner} from "typeorm";

export class staking1646046387022 implements MigrationInterface {
    name = 'staking1646046387022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staking_detailed" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_803545dbc4344b7cbeda9c7eb85" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE TABLE "staking" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_f042bc3f5779d0be7c6af84c766" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "staking"`);
        await queryRunner.query(`DROP TABLE "staking_detailed"`);
    }

}
