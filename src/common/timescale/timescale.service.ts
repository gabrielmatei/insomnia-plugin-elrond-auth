import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { AggregateEnum } from 'src/modules/models/aggregate.enum';
import { QueryInput } from 'src/modules/models/query.input';
import { EntityTarget, getRepository } from 'typeorm';
import { CachingService } from '../caching/caching.service';
import { CacheInfo } from '../caching/entities/cache.info';
import { AggregateValue } from '../entities/aggregate-value.object';
import { GenericIngestEntity } from './entities/generic-ingest.entity';
import { TradingInfoEntity } from './entities/trading-info.entity';
import * as timescaleQueries from './timescale.queries';

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
      this.logger.error(`An unhandled error occurred when writing data on '${GenericIngestEntity.getName(entityTarget)}'`);
      this.logger.error(error);

      throw error;
    }
  }

  public async writeTrades(trades: TradingInfoEntity[]): Promise<void> {
    try {
      const repository = getRepository(TradingInfoEntity);
      for (const trade of trades) {
        try {
          await repository.save(trade);
        } catch (error: any) {
          if (error?.constraint === 'UQ_ID') {
            this.logger.log(`Could not insert duplicate trade with identifier '${trade.identifier}'`);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      this.logger.error(`An unhandled error occurred when writing trades`);
      this.logger.error(error);

      throw error;
    }
  }

  public async getPreviousValue24h<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    currentTimestamp: Date,
    key: string,
    series: string
  ): Promise<number | undefined> {
    const repository = getRepository(entityTarget);
    const query = timescaleQueries.getPreviousValue24hQuery(repository, currentTimestamp, series, key);

    const entity = await query.getOne();
    return entity?.value;
  }

  public async getLastValue<T extends GenericIngestEntity>(
    entityTarget: EntityTarget<T>,
    series: string,
    key: string
  ): Promise<AggregateValue | undefined> {
    const repository = getRepository(entityTarget);
    const query = timescaleQueries.getLastValueQuery(repository, series, key);

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

    const query = timescaleQueries.getValuesQuery(repository, startDate, endDate, resolution, aggregateList);
    const rows: any[] = await repository.query(query, [series, key]);

    const values = rows.map(row => AggregateValue.fromRow(row));
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
      throw new BadRequestException(`At least one aggregate function is required`);
    }

    if (aggregates.length === 1 && aggregates[0] === AggregateEnum.LAST && query === undefined) {
      const lastValue = await this.getLastValue(entity, series, key);
      if (!lastValue) {
        return [];
      }
      return [lastValue];
    }

    if (!query) {
      throw new BadRequestException(`'query' is required`);
    }

    let startDate = query.start_date;
    if (query.range) {
      startDate = moment.utc().subtract(1, query.range).toDate();
    } else if (!startDate) {
      throw new BadRequestException(`'start_date' or 'range' is required`);
    }

    if (!query.resolution) {
      throw new BadRequestException(`'resolution' is required`);
    }

    const values = await this.getValues(entity, series, key, startDate, query.end_date, query.resolution, aggregates);
    return values;
  }

  public async getLastTrade(firstTokenIdentifier: string, secondTokenIdentifier: string, lte: Date): Promise<TradingInfoEntity | undefined> {
    try {
      const repository = getRepository(TradingInfoEntity);
      const query = timescaleQueries.getLastTradeQuery(repository, firstTokenIdentifier, secondTokenIdentifier, lte);

      const entity = await query.getOne();
      return entity;
    } catch (error) {
      this.logger.error(`An unhandled error occurred when getting last WEGLD price`);
      this.logger.error(error);

      return undefined;
    }
  }
}
