import moment from "moment";
import { AggregateEnum } from "src/modules/models/aggregate.enum";
import { DateUtils } from "src/utils/date.utils";
import { Repository, SelectQueryBuilder } from "typeorm";
import { GenericIngestEntity } from "./entities/generic-ingest.entity";
import { TradingInfoEntity } from "./entities/trading-info.entity";

export function getPreviousValue24hQuery<T extends GenericIngestEntity>(
  repository: Repository<T>,
  currentTimestamp: Date,
  series: string,
  key: string,
): SelectQueryBuilder<T> {
  const ago24h = moment.utc(currentTimestamp).add(-1, 'days').toISOString();

  let query = repository
    .createQueryBuilder()
    .where('key = :key')
    .andWhere('timestamp < :ago24h')
    .setParameters({
      key,
      series,
      ago24h,
    })
    .orderBy('timestamp', 'DESC')
    .limit(1);

  if (series) {
    query = query.andWhere('series = :series');
  }

  return query;
}

export function getLastValueQuery<T extends GenericIngestEntity>(
  repository: Repository<T>,
  series: string,
  key: string
): SelectQueryBuilder<T> {
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

  return query;
}

export function getAggregateValueQuery<T extends GenericIngestEntity>(
  repository: Repository<T>,
  startDate: Date,
  endDate: Date | undefined,
  aggregateList: string[],
): string {
  const tableName = repository.metadata.tableName;

  const aggregates = aggregateList.map(aggregate => {
    const agg = aggregate === AggregateEnum.FIRST || aggregate === AggregateEnum.LAST
      ? `${aggregate}(value, timestamp) AS ${aggregate.toLowerCase()}`
      : `${aggregate}(value) AS ${aggregate.toLowerCase()}`;
    return agg;
  });

  const query = `
    SELECT ${aggregates.join(',')}
    FROM ${tableName} 
    WHERE series = $1
        AND key = $2
        ${endDate
      ? `AND timestamp BETWEEN '${startDate.toISOString()}' AND '${endDate?.toISOString()}'`
      : `AND timestamp >= '${startDate.toISOString()}'`}
  `;

  return query;
}

export function getValuesQuery<T extends GenericIngestEntity>(
  repository: Repository<T>,
  startDate: Date,
  endDate: Date | undefined,
  resolution: string,
  aggregateList: string[],
): string {
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

  return query;
}

export function getLastTradeQuery(
  repository: Repository<TradingInfoEntity>,
  firstTokenIdentifier: string,
  secondTokenIdentifier: string,
  lte: Date
): SelectQueryBuilder<TradingInfoEntity> {
  const query = repository
    .createQueryBuilder()
    .where('timestamp <= :lte')
    .andWhere('"firstToken" = :firstTokenIdentifier')
    .andWhere('"secondToken" = :secondTokenIdentifier')
    .setParameters({
      lte,
      firstTokenIdentifier,
      secondTokenIdentifier,
    })
    .orderBy('timestamp', 'DESC')
    .limit(1);

  return query;
}

export function getLastTradeValueQuery(
  repository: Repository<TradingInfoEntity>,
  firstToken: string,
  secondToken: string,
): SelectQueryBuilder<TradingInfoEntity> {
  const query = repository
    .createQueryBuilder()
    .where('"firstToken" = :firstToken')
    .andWhere('"secondToken" = :secondToken')
    .setParameters({ firstToken, secondToken })
    .orderBy('timestamp', 'DESC')
    .limit(1);

  return query;
}

export function getAggregateTradeValueQuery(
  repository: Repository<TradingInfoEntity>,
  firstToken: string,
  secondToken: string,
  series: string,
  startDate: Date,
  endDate: Date | undefined,
  aggregateList: string[],
): string {
  const tableName = repository.metadata.tableName;

  const aggregates = aggregateList.map(aggregate => {
    const agg = aggregate === AggregateEnum.FIRST || aggregate === AggregateEnum.LAST
      ? `${aggregate}(${series}, timestamp) AS ${aggregate.toLowerCase()}`
      : `${aggregate}(${series}) AS ${aggregate.toLowerCase()}`;
    return agg;
  });

  const query = `
    SELECT ${aggregates.join(',')}
    FROM ${tableName} 
    WHERE "firstToken" = '${firstToken}' AND "secondToken" = '${secondToken}'
        ${endDate
      ? `AND timestamp BETWEEN '${startDate.toISOString()}' AND '${endDate?.toISOString()}'`
      : `AND timestamp >= '${startDate.toISOString()}'`}
  `;

  return query;
}

export function getTradeValuesQuery(
  repository: Repository<TradingInfoEntity>,
  firstToken: string,
  secondToken: string,
  series: string,
  startDate: Date,
  endDate: Date | undefined,
  resolution: string,
  aggregateList: string[],
): string {
  const tableName = repository.metadata.tableName;

  const aggregates = aggregateList.map(aggregate => {
    const agg = aggregate === AggregateEnum.FIRST || aggregate === AggregateEnum.LAST
      ? `${aggregate}(${series}, timestamp) AS ${aggregate.toLowerCase()}`
      : `${aggregate}(${series}) AS ${aggregate.toLowerCase()}`;
    return agg;
  });

  const query = `
    SELECT
      time_bucket('${resolution}', timestamp) AS time,
      ${aggregates.join(',')}
    FROM ${tableName} 
    WHERE "firstToken" = '${firstToken}' AND "secondToken" = '${secondToken}'
        ${endDate
      ? `AND timestamp BETWEEN '${startDate.toISOString()}' AND '${endDate?.toISOString()}'`
      : `AND timestamp >= '${startDate.toISOString()}'`}
    GROUP BY time
    ORDER BY time ASC
  `;

  return query;
}

export function getCandlesticks(
  firstToken: string,
  secondToken: string,
  fromTimestamp: number,
  toTimestamp: number,
  resolution: number
): string {
  const from = DateUtils.unixTimestampToSql(fromTimestamp);
  const to = DateUtils.unixTimestampToSql(toTimestamp);

  const query = `
    SELECT
      time_bucket('${resolution} seconds', timestamp) AS time,
      first(price, (timestamp + id * interval '1 milliseconds')) AS open,
      last(price, (timestamp + id * interval '1 milliseconds')) AS close,
      max(price) AS high,
      min(price) AS low,
      sum(volume) AS volume,
      count(*) as count
    FROM trading_info
    WHERE "firstToken" = '${firstToken}' AND "secondToken" = '${secondToken}' AND timestamp BETWEEN '${from}' AND '${to}'
    GROUP BY time
    ORDER BY time ASC;
  `;

  return query;
}

export function getLastCandlestickWithResolution(
  firstToken: string,
  secondToken: string,
  toTimestamp: number,
  resolution: number
): string {
  const to = DateUtils.unixTimestampToSql(toTimestamp);

  const query = `
    SELECT
      time_bucket('${resolution} seconds', timestamp) AS time,
      first(price, (timestamp + id * interval '1 milliseconds')) AS open,
      last(price, (timestamp + id * interval '1 milliseconds')) AS close,
      max(price) AS high,
      min(price) AS low,
      sum(volume) AS volume,
      count(*) as count
    FROM trading_info
    WHERE "firstToken" = '${firstToken}' AND "secondToken" = '${secondToken}' AND timestamp < '${to}'
    GROUP BY time
    ORDER BY time DESC
    LIMIT 1;
  `;

  return query;
}
