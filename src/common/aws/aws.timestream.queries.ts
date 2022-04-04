import { DateUtils } from "src/utils/date.utils";
import { Pair } from '../maiar-dex/entities/pair';

export function getPoolVolumesQuery(tableName: string, pairs: Pair[], fromDate: Date, toDate: Date): string {
  const from = DateUtils.dateToSql(fromDate);
  const to = DateUtils.dateToSql(toDate);

  const series = pairs
    .map(pair => pair.address)
    .map(address => `'${address}'`).join(', ');

  return `
    SELECT
      series,
      SUM(measure_value::double) as volume
    FROM ${tableName}
    WHERE measure_name = 'volumeUSD'
      AND series IN (${series})
      AND time BETWEEN '${from}' AND '${to}' 
    GROUP BY series
    ORDER BY volume DESC
  `;
}

export function getTokenBurntVolumeQuery(tableName: string, token: string, fromDate: Date, toDate: Date): string {
  const from = DateUtils.dateToSql(fromDate);
  const to = DateUtils.dateToSql(toDate);

  return `
    SELECT SUM(measure_value::double)
    FROM ${tableName}
    WHERE measure_name IN ('penaltyBurned', 'feeBurned')
      AND series = '${token}'
      AND time BETWEEN '${from}' AND '${to}'
  `;
}

export function getTotalVolumeQuery(tableName: string, pairs: Pair[], fromDate: Date, toDate: Date): string {
  const from = DateUtils.dateToSql(fromDate);
  const to = DateUtils.dateToSql(toDate);

  const series = pairs
    .map(pair => pair.address)
    .map(address => `'${address}'`).join(', ');

  return `
    SELECT SUM(measure_value::double)
    FROM ${tableName}
    WHERE measure_name = 'volumeUSD'
      AND series IN (${series})
      AND time BETWEEN '${from}' AND '${to}' 
  `;
}
