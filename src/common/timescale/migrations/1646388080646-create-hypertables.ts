import { MigrationInterface, QueryRunner } from "typeorm";

export class createHypertables1646388080646 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT create_hypertable('accounts_historical', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('accounts', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('economics', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('exchanges_historical', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('exchanges', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('github-activity', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('github', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('google', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('prices', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('quotes', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('staking_historical_backup', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('staking_historical', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('staking', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('transactions_detailed', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('transactions', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('trends', 'timestamp')`);
    await queryRunner.query(`SELECT create_hypertable('twitter', 'timestamp')`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    // do nothing
  }
}
