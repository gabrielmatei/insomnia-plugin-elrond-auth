import { GenericIngestEntity } from "src/common/timescale/entities/generic-ingest.entity";
import { Constants } from "src/utils/constants";
import { EntityTarget } from "typeorm";
import * as crypto from "crypto";
import { QueryInput } from "src/modules/models/query.input";

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
    query: QueryInput
  ): CacheInfo {
    const cacheKeyRaw = JSON.stringify({
      entity: entity.toString(),
      series,
      key,
      query,
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
}
