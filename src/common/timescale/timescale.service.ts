import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
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
    }
  }

  public async getPreviousValue24h<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, currentTimestamp: Date, key: string, series?: string): Promise<number | undefined> {
    const repository = getRepository(entityTarget);

    let query = repository
      .createQueryBuilder()
      .where('key = :key')
      .andWhere('timestamp >= :ago24h')
      .setParameters({
        key,
        series,
        now: currentTimestamp.toISOString(),
        ago24h: moment.utc(currentTimestamp).add(-1, 'days').toISOString(),
      })
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

  public async getLastValue<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, series: string, key: string): Promise<number | undefined> {
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
    return entity.value;
  }
}
