import { MigrationInterface, QueryRunner } from "typeorm";

export class tradingInfoIndex1649858746850 implements MigrationInterface {
    name = 'tradingInfoIndex1649858746850';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trading_info" ADD CONSTRAINT "UQ_ID" UNIQUE ("identifier", "firstToken", "secondToken")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trading_info" DROP CONSTRAINT "UQ_ID"`);
    }

}
