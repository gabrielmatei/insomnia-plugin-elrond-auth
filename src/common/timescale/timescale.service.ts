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

  constructor(
    private readonly cachingService: CachingService,
  ) {
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
      const distinctTrades = trades.filter((a, i) => trades
        .findIndex((s) => `${a.identifier}${a.firstToken}${a.secondToken}` === `${s.identifier}${s.firstToken}${s.secondToken}`) === i);

      const repository = getRepository(TradingInfoEntity);
      const query = repository
        .createQueryBuilder()
        .insert()
        .into(TradingInfoEntity)
        .values(distinctTrades)
        .orUpdate(["price", "volume", "fee"], "UQ_ID");

      await query.execute();
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

  private async getLastValue<T extends GenericIngestEntity>(
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

  private async getValues<T extends GenericIngestEntity>(
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
    query: QueryInput | undefined,
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
    query: QueryInput | undefined,
    aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.resolveQueryGeneric(
      query,
      aggregates,
      async () => await this.getLastValue(entity, series, key),
      async () => await this.getValues(entity, series, key, QueryInput.getStartDate(query!), query?.end_date, query?.resolution ?? '', aggregates),
    );
  }

  public async resolveTradingQuery(
    firstToken: string,
    secondToken: string,
    series: string,
    query: QueryInput,
    aggregates: AggregateEnum[]
  ): Promise<AggregateValue[]> {
    const cacheInfo = CacheInfo.TradingQueryResult(firstToken, secondToken, series, query, aggregates);

    return await this.cachingService.getOrSetCache(
      cacheInfo.key,
      async () => await this.resolveTradingQueryRaw(firstToken, secondToken, series, query, aggregates),
      cacheInfo.ttl,
    );
  }

  public async resolveTradingQueryRaw(
    firstToken: string,
    secondToken: string,
    series: string,
    query: QueryInput,
    aggregates: AggregateEnum[]
  ): Promise<AggregateValue[]> {
    return await this.resolveQueryGeneric(
      query,
      aggregates,
      async () => await this.getLastTradeValue(firstToken, secondToken, series),
      async () => await this.getTradeValues(firstToken, secondToken, series, QueryInput.getStartDate(query), query.end_date, query.resolution ?? '', aggregates),
    );
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

  private async resolveQueryGeneric(
    query: QueryInput | undefined,
    aggregates: AggregateEnum[],
    getLastValue: () => Promise<AggregateValue | undefined>,
    getValues: () => Promise<AggregateValue[]>,
  ): Promise<AggregateValue[]> {
    if (aggregates.length === 0) {
      throw new BadRequestException(`At least one aggregate function is required`);
    }

    if (aggregates.length === 1 && aggregates[0] === AggregateEnum.LAST && query === undefined) {
      const lastValue = await getLastValue();
      if (!lastValue) {
        return [];
      }
      return [lastValue];
    }

    if (!query) {
      throw new BadRequestException(`'query' is required`);
    }

    // start date validation
    QueryInput.getStartDate(query);

    if (!query.resolution) {
      throw new BadRequestException(`'resolution' is required`);
    }

    const values = await getValues();
    return values;
  }

  private async getLastTradeValue(firstToken: string, secondToken: string, series: string): Promise<AggregateValue | undefined> {
    const repository = getRepository(TradingInfoEntity);
    const query = timescaleQueries.getLastTradeValueQuery(repository, firstToken, secondToken);

    const entity = await query.getOne();
    if (!entity) {
      return undefined;
    }

    return new AggregateValue({
      last: (entity as any)[series],
      time: moment(entity.timestamp).toISOString(),
    });
  }

  private async getTradeValues(
    firstToken: string,
    secondToken: string,
    series: string,
    startDate: Date,
    endDate: Date | undefined,
    resolution: string,
    aggregateList: string[],
  ): Promise<AggregateValue[]> {
    const repository = getRepository(TradingInfoEntity);

    const query = timescaleQueries.getTradeValuesQuery(repository, firstToken, secondToken, series, startDate, endDate, resolution, aggregateList);
    const rows: any[] = await repository.query(query, []);

    const values = rows.map(row => AggregateValue.fromRow(row));
    return values;
  }
}
