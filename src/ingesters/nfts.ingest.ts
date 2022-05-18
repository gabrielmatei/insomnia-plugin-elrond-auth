import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { CachingService } from "src/common/caching/caching.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { QueryConditionOptions } from "src/common/elastic/entities/query.condition.options";
import { QueryType } from "src/common/elastic/entities/query.type";
import { TransactionsEntity } from "src/common/timescale/entities/transactions.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";

@Injectable()
export class NftsIngest implements Ingest {
  public static readonly ACTIVE_NFT_WALLETS = "active:nft-wallets";

  public readonly name = NftsIngest.name;
  public readonly entityTarget = TransactionsEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly cachingService: CachingService,
  ) { }

  public async fetch(): Promise<IngestRecords[]> {
    const timestamp = moment.utc().startOf('day').subtract(1, 'days').toDate();

    // eslint-disable-next-line require-await
    const computeNftsPage = async (_index: number, nfts: any[]) => {
      for (const nft of nfts) {
        await this.cachingService.addInSet(NftsIngest.ACTIVE_NFT_WALLETS, nft.address);
      }
    };

    const elasticQuery = ElasticQuery.create()
      .withPagination({ size: 10000 })
      .withFields(['address'])
      .withCondition(QueryConditionOptions.must, QueryType.Exists('identifier'))
      .withMustCondition(QueryType.Match('type', 'NonFungibleESDT'));
    await this.elasticService.computeAllItems(this.apiConfigService.getElasticUrl(), 'accountsesdt', 'id', elasticQuery, computeNftsPage);

    const walletsCount = await this.cachingService.getSetMembersCount(NftsIngest.ACTIVE_NFT_WALLETS);

    const data = {
      nfts: {
        wallets_count: walletsCount,
      },
    };
    return [{
      entity: TransactionsEntity,
      records: TransactionsEntity.fromObject(timestamp, data),
    }];
  }
}
