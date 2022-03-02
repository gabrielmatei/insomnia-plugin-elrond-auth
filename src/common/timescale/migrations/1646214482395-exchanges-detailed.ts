import {MigrationInterface, QueryRunner} from "typeorm";

export class exchangesDetailed1646214482395 implements MigrationInterface {
    name = 'exchangesDetailed1646214482395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "exchanges_detailed" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_31f7b1941484b6545bd92145113" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "exchanges_detailed"`);
    }

}
