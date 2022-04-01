import { MigrationInterface, QueryRunner } from "typeorm";

export class maiarDex1648805460802 implements MigrationInterface {
  name = 'maiarDex1648805460802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "maiar_dex" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_46d1c4fbe3e517b3fc56f9dbcb4" PRIMARY KEY ("id", "timestamp"))`);

    await queryRunner.query(`SELECT create_hypertable('maiar_dex', 'timestamp')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "maiar_dex"`);
  }
}
