import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
        ? `${aggregate}(value, timestamp) AS ${aggregate}`
        : `${aggregate}(value) AS ${aggregate}`;
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
    aggregates: AggregateEnum[]
  ): Promise<AggregateValue[]> {
    const cacheInfo = CacheInfo.QueryResult(entity, series, key, query, aggregates);

    return await this.cachingService.getOrSetCache(
      cacheInfo.key,
      async () => await this.resolveQueryRaw(entity, series, key, query, aggregates),
      cacheInfo.ttl,
    );
  }

  private async resolveQueryRaw<T extends GenericIngestEntity>(
    entity: EntityTarget<T>,
    series: string,
    key: string,
    query: QueryInput,
    aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    if (aggregates.length === 0) {
      throw new BadRequestException('An aggregate function is required');
    }

    if (aggregates.length === 1 && aggregates[0] === AggregateEnum.LAST && query === undefined) {
      const lastValue = await this.getLastValue(entity, series, key);
      if (!lastValue) {
        return [];
      }
      return [lastValue];
    }

    if (!query) {
      throw new BadRequestException('Query required');
    }

    let startDate = query.start_date;
    if (query.range) {
      startDate = moment.utc().subtract(1, query.range).toDate();
    } else if (!startDate) {
      throw new BadRequestException('start date or range required');
    }

    if (!query.resolution) {
      throw new BadRequestException('resolution required');
    }

    const values = await this.getValues(entity, series, key, startDate, query.end_date, query.resolution, aggregates);
    return values;
  }
}
