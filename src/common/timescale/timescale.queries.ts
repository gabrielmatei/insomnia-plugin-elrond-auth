import moment from "moment";
import { AggregateEnum } from "src/modules/models/aggregate.enum";
import { Repository, SelectQueryBuilder } from "typeorm";
import { GenericIngestEntity } from "./entities/generic-ingest.entity";

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
