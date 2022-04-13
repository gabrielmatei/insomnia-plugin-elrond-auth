import { GenericIngestEntity } from "src/common/timescale/entities/generic-ingest.entity";
import { Constants } from "src/utils/constants";
import { EntityTarget } from "typeorm";
import * as crypto from "crypto";
import { QueryInput } from "src/modules/models/query.input";
import { AggregateEnum } from "src/modules/models/aggregate.enum";

export class CacheInfo {
  key: string = "";
  ttl: number = Constants.oneSecond() * 6;

  static Repositories(organization: string): CacheInfo {
    return {
      key: `repositories:${organization}`,
      ttl: Constants.oneHour(),
    };
  }

  static QueryResult<T extends GenericIngestEntity>(
    entity: EntityTarget<T>,
    series: string,
    key: string,
    query: QueryInput,
    aggregates: AggregateEnum[],
  ): CacheInfo {
    const cacheKeyRaw = JSON.stringify({
      entity: entity.toString(),
      series,
      key,
      query,
      aggregates,
    });
    const keyHash = crypto.createHash('sha1').update(cacheKeyRaw).digest('base64');

    return {
      key: `q:${keyHash}`,
      ttl: Constants.oneMinute(),
    };
  }

  static NftCollection(collection: string): CacheInfo {
    return {
      key: `nft:${collection}`,
      ttl: Constants.oneWeek(),
    };
  }

  static MaiarDexPairs: CacheInfo = {
    key: 'maiarDexPairs',
    ttl: Constants.oneHour(),
  };

  static Token(tokenIdentifier: string): CacheInfo {
    return {
      key: `token:${tokenIdentifier}`,
      ttl: Constants.oneHour(),
    };
  }

  static LastWEGLDPrice: CacheInfo = {
    key: 'lastWEGLDPrice',
    ttl: Constants.oneMinute() * 30,
  };

  static ScheduledJob(job: string = '*'): CacheInfo {
    return {
      key: `scheduledJob:${job}`,
      ttl: Constants.oneHour(),
    };
  }
}
