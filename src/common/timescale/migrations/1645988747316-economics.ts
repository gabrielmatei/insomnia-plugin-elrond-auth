import {MigrationInterface, QueryRunner} from "typeorm";

export class economics1645988747316 implements MigrationInterface {
    name = 'economics1645988747316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "economics" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" integer NOT NULL, CONSTRAINT "PK_93681614be24ece334fc17d3eb0" PRIMARY KEY ("id", "timestamp"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "economics"`);
    }

}
