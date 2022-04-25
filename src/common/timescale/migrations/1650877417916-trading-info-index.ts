import { MigrationInterface, QueryRunner } from "typeorm";

export class tradingInfoIndex1650877417916 implements MigrationInterface {
    name = 'tradingInfoIndex1650877417916';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_2e4af7a17c2925007d43ddbc18" ON "trading_info" ("firstToken", "secondToken") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_2e4af7a17c2925007d43ddbc18"`);
    }
}
