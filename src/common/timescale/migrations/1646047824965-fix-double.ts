import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDouble1646047824965 implements MigrationInterface {
    name = 'fixDouble1646047824965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts_balance" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_balance" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_count" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_count" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation_legacy_active" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation_legacy_active" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_total_balance_with_stake" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_total_balance_with_stake" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_total_stake" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_total_stake" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "economics" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "economics" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exchanges" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "exchanges" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "github" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "github" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "google_trends" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "google_trends" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "google" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "google" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staking_detailed" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "staking_detailed" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staking" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "staking" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "twitter" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "twitter" ADD "value" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitter" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "twitter" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staking" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "staking" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staking_detailed" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "staking_detailed" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quotes" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "google" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "google" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "google_trends" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "google_trends" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "github" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "github" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exchanges" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "exchanges" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "economics" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "economics" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_total_stake" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_total_stake" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_total_balance_with_stake" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_total_balance_with_stake" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation_legacy_active" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_delegation_legacy_active" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_count" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_count" ADD "value" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accounts_balance" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "accounts_balance" ADD "value" integer NOT NULL`);
    }

}
