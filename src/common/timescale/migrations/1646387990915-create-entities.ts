import { MigrationInterface, QueryRunner } from "typeorm";

export class createEntities1646387990915 implements MigrationInterface {
  name = 'createEntities1646387990915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "accounts_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_1007506a5fb139807df711d8379" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_833174cf2dc62ce74067a64923f" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "economics" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_93681614be24ece334fc17d3eb0" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "exchanges_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_9c799ba0452560bcaa5f73970d9" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "exchanges" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_c61bc9085110d0b5504738b385a" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "github-activity" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_895bdeef9b02870c257ef0ab753" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "github" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_8da985c9ddf375a93e5741a433d" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "google" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_92944d71177b14b0bc7566a9b00" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "prices" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_77b6266548d6e1f03badacf1b9f" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "quotes" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_adc26ff6ab80ef590cc14c8ea3a" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "staking_historical_backup" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_5e7933ecf9963bc2c089602eb76" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "staking_historical" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f3dc77cbe5ac044e37c18b34511" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "staking" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f042bc3f5779d0be7c6af84c766" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "transactions_detailed" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_35b03a749d381a67e13aafd0b88" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_7b206ce56e6cf54dcc6fdabab29" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "trends" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_f87d3829b8e6ddfbe04ab828ea7" PRIMARY KEY ("id", "timestamp"))`);
    await queryRunner.query(`CREATE TABLE "twitter" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL, "series" character varying, "key" character varying NOT NULL, "value" double precision NOT NULL, CONSTRAINT "PK_80ab6df6a5fd39dfed583ec8eea" PRIMARY KEY ("id", "timestamp"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitter"`);
    await queryRunner.query(`DROP TABLE "trends"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "transactions_detailed"`);
    await queryRunner.query(`DROP TABLE "staking"`);
    await queryRunner.query(`DROP TABLE "staking_historical"`);
    await queryRunner.query(`DROP TABLE "staking_historical_backup"`);
    await queryRunner.query(`DROP TABLE "quotes"`);
    await queryRunner.query(`DROP TABLE "prices"`);
    await queryRunner.query(`DROP TABLE "google"`);
    await queryRunner.query(`DROP TABLE "github"`);
    await queryRunner.query(`DROP TABLE "github-activity"`);
    await queryRunner.query(`DROP TABLE "exchanges"`);
    await queryRunner.query(`DROP TABLE "exchanges_historical"`);
    await queryRunner.query(`DROP TABLE "economics"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TABLE "accounts_historical"`);
  }

}
