import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { AggregateEnum } from 'src/modules/models/aggregate.enum';
import { QueryInput } from 'src/modules/models/query.input';
import { EntityTarget, getRepository } from 'typeorm';
import { CachingService } from '../caching/caching.service';
import { CacheInfo } from '../caching/entities/cache.info';
import { AggregateValue } from '../entities/aggregate-value.object';
import { GenericIngestEntity } from './entities/generic-ingest.entity';

@Injectable()
export class TimescaleService {
  private readonly logger: Logger;

  constructor(private readonly cachingService: CachingService) {
    this.logger = new Logger(TimescaleService.name);
  }

  public async writeData<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, entity: T | T[]): Promise<void> {
    try {
      const repository = getRepository(entityTarget);

      this.logger.log(`Write ${Array.isArray(entity) ? entity.length : 1} records on '${GenericIngestEntity.getName(entityTarget)}`);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await repository.save(entity);
    } catch (error) {
      this.logger.error(`An unhandled error writing data on '${GenericIngestEntity.getName(entityTarget)}'`);
      this.logger.error(error);

      throw error;
    }
  }

  public async getPreviousValue24h<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, currentTimestamp: Date, key: string, series?: string): Promise<number | undefined> {
    const params = {
      key,
      series,
      ago24h: moment.utc(currentTimestamp).add(-1, 'days').toISOString(),
    };

    const repository = getRepository(entityTarget);
    let query = repository
      .createQueryBuilder()
      .where('key = :key')
      .andWhere('timestamp < :ago24h')
      .setParameters(params)
      .orderBy('timestamp', 'DESC')
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

  public async getLastValue<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    series: string,
    key: string
  ): Promise<AggregateValue | undefined> {
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

    return new AggregateValue({
      last: entity.value,
      time: moment(entity.timestamp).toISOString(),
    });
  }

  public async getValues<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    series: string,
    key: string,
    startDate: Date,
    endDate: Date | undefined,
    resolution: string,
    aggregateList: string[],
  ): Promise<AggregateValue[]> {
    const repository = getRepository(entityTarget);
    const tableName = repository.metadata.tableName;

    const aggregates = aggregateList.map(aggregate => {
      const agg = aggregate === AggregateEnum.FIRST || aggregate === AggregateEnum.LAST
        ? `${aggregate}(value, timestamp) AS ${aggregate.toLowerCase()}`
        : `${aggregate}(value) AS ${aggregate.toLowerCase()}`;
      return agg;
    });

    const query = `
      SELECT
        time_bucket('${resolution}', timestamp) AS time,
        ${aggregates.join(',')}
      FROM ${tableName} 
      WHERE series = $1
          AND key = $2
          ${endDate
        ? `AND timestamp BETWEEN '${startDate.toISOString()}' AND '${endDate?.toISOString()}'`
        : `AND timestamp >= '${startDate.toISOString()}'`}
      GROUP BY time
      ORDER BY time ASC
    `;
    const rows: any[] = await repository.query(query, [series, key]);

    const values = rows.map(row => new AggregateValue({
      time: moment(row.time).toISOString(),
      first: row.first,
      last: row.last,
      min: row.min,
      max: row.max,
      count: row.count,
      sum: row.sum,
      avg: row.avg,
    }));
    return values;
  }

  public async resolveQuery<T extends GenericIngestEntity>(
    entity: EntityTarget<T>,
    series: string,
    key: string,
    query: QueryInput,
  ): Promise<AggregateValue[]> {
    const cacheInfo = CacheInfo.QueryResult(entity, series, key, query);

    return await this.cachingService.getOrSetCache(
      cacheInfo.key,
      async () => await this.resolveQueryRaw(entity, series, key, query),
      cacheInfo.ttl,
    );
  }

  private async resolveQueryRaw<T extends GenericIngestEntity>(
    entity: EntityTarget<T>,
    series: string,
    key: string,
    query: QueryInput,
  ): Promise<AggregateValue[]> {
    if (query.aggregate === AggregateEnum.LAST && query.resolution === undefined) {
      const lastValue = await this.getLastValue(entity, series, key);
      if (!lastValue) {
        return [];
      }
      return [lastValue];
    }

    if (!query.aggregate && !query.aggregates) {
      throw new Error('aggregate or aggregates required');
    }

    if (query.aggregate !== undefined && query.aggregates !== undefined) {
      throw new Error('only one aggregate param');
    }

    let startDate = query.start_date;
    if (query.range) {
      startDate = moment.utc().subtract(1, query.range).toDate();
    } else if (!startDate) {
      throw new Error('start date or range required');
    }

    if (!query.resolution) {
      throw new Error('resolution required');
    }

    const aggregateList = [query.aggregate, ...(query.aggregates ?? [])]
      .filter((agg): agg is AggregateEnum => !!agg)
      .distinct();

    const values = await this.getValues(entity, series, key, startDate, query.end_date, query.resolution, aggregateList);
    return values;
  }
}
