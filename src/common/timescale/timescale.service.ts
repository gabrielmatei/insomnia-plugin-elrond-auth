import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { ScalarValue } from 'src/modules/values/models/values.model';
import { DateUtils } from 'src/utils/date.utils';
import { EntityTarget, getRepository } from 'typeorm';
import { GenericIngestEntity } from './entities/generic-ingest.entity';

@Injectable()
export class TimescaleService {
  private readonly logger: Logger;

  constructor(
  ) {
    this.logger = new Logger(TimescaleService.name);
  }

  public async writeData<T>(entityTarget: EntityTarget<T>, entity: T | T[]): Promise<void> {
    try {
      const repository = getRepository(entityTarget);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await repository.save(entity);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getPreviousValue24h<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, currentTimestamp: Date, key: string, series?: string): Promise<number | undefined> {
    const params = {
      key,
      series,
      now: currentTimestamp.toISOString(),
      ago24h: moment.utc(currentTimestamp).add(-1, 'days').toISOString(),
    };

    const repository = getRepository(entityTarget);
    let query = repository
      .createQueryBuilder()
      .where('key = :key')
      .andWhere('timestamp >= :ago24h')
      .setParameters(params)
      .orderBy('timestamp', 'ASC')
      .limit(1);

    if (series) {
      query = query.andWhere('series = :series');
    }

    const entity = await query.getOne();
    if (!entity) {
      return undefined;
    }
    return entity.value;
  }

  // public async getLastValue<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, series: string): Promise<T[]> {
  //   // TODO filter keys
  //   const repository = getRepository(entityTarget);
  //   const tableName = repository.metadata.tableName;

  //   const results = await repository.query(
  //     `SELECT * FROM ${tableName} 
  //      WHERE series = $1 AND timestamp = (SELECT MAX(timestamp) FROM ${tableName} WHERE series = $1)`,
  //     [series]);

  //   return results;
  // }

  public async getLastValue<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    series: string,
    key: string
  ): Promise<{ time: string, value: number } | undefined> {
    const repository = getRepository(entityTarget);
    const query = repository
      .createQueryBuilder()
      .where('key = :key')
      .andWhere('series = :series')
      .setParameters({
        key,
        series,
      })
      .orderBy('timestamp', 'DESC')
      .limit(1);

    const entity = await query.getOne();
    if (!entity) {
      return undefined;
    }

    return new ScalarValue({
      value: entity.value,
      time: DateUtils.timescaleToUtc(entity.timestamp),
    });
  }

  public async getValues<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    series: string,
    key: string,
    startDate: Date,
    endDate: Date,
    resolution: string
  ): Promise<{ time: string, value: number }[]> {
    const repository = getRepository(entityTarget);
    const tableName = repository.metadata.tableName;

    const rows = await repository.query(
      `SELECT
        time_bucket('${resolution}', timestamp) AS time,
        first(value, timestamp) AS value
       FROM ${tableName} 
       WHERE series = $1
          AND key = $2
          AND timestamp BETWEEN $3 AND $4
       GROUP BY time
       ORDER BY time ASC`,
      [series, key, startDate.toISOString(), endDate.toISOString()]
    );

    return rows.map((row: any) => new ScalarValue({
      value: row.value,
      time: DateUtils.timescaleToUtc(row.time),
    }));
  }
}
