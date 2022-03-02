import {MigrationInterface, QueryRunner} from "typeorm";

export class activeUsers1646223744633 implements MigrationInterface {
    name = 'activeUsers1646223744633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "active_users" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_2c0445523281aa9920955a1e6f6" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "active_users"`);
    }

}
