import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ElasticService } from "src/common/elastic/elastic.service";
import { ElasticQuery } from "src/common/elastic/entities/elastic.query";
import { RangeQuery } from "src/common/elastic/entities/range.query";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import BigNumber from "bignumber.js";
import { Injectable, Logger } from "@nestjs/common";
import { GatewayService } from "src/common/gateway/gateway.service";
import { CachingService } from "src/common/caching/caching.service";
import { TransactionsDetailedEntity } from "src/common/timescale/entities/transactions-detailed.entity";
import { TransactionsService } from "src/common/transactions/transactions.service";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";

@Injectable()
export class TransactionsDetailedIngest implements Ingest {
  public static readonly ACTIVE_ACCOUNTS_KEY = "active:accounts";
  public static readonly ACTIVE_TOKENS_KEY = "active:tokens";
  public static readonly ACTIVE_NFT_COLLECTIONS_KEY = "active:nfts";
  public static readonly ACTIVE_CONTRACTS_KEY = "active:contracts";

  public readonly name = TransactionsDetailedIngest.name;
  public readonly entityTarget = TransactionsDetailedEntity;

  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly elasticService: ElasticService,
    private readonly gatewayService: GatewayService,
    private readonly cachingService: CachingService,
    private readonly transactionsService: TransactionsService,
  ) {
    this.logger = new Logger(TransactionsDetailedIngest.name);
  }

  public async fetch(): Promise<IngestRecords[]> {
    const startDate = moment.utc().startOf('day').subtract(1, 'day');
    const endDate = moment.utc().startOf('day');

    const elasticQuery = ElasticQuery.create()
      .withPagination({ size: 10000 })
      .withFilter([
        new RangeQuery('timestamp', {
          gte: startDate.unix(),
          lt: endDate.unix(),
        }),
      ]);

    await this.deleteSetKeys();

    let valueMoved = new BigNumber(0);
    let totalFees = new BigNumber(0);
    let totalTokenTransfers = new BigNumber(0);
    let totalNftTransfers = new BigNumber(0);
    let totalContractsTransfers = new BigNumber(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.elasticService.computeAllItems(this.apiConfigService.getElasticUrl(), 'transactions', 'hash', elasticQuery, async (index: number, transactions: any[]) => {
      this.logger.log(`Start computing page ${index} with ${transactions.length} transactions`);

      const [
        _valueMoved,
        _totalFees,
        _totalTokenTransfers,
        _totalNftTransfers,
        _totalContractsTransfers,
      ] = await this.computeTransactionsPage(transactions);

      valueMoved = valueMoved.plus(_valueMoved);
      totalFees = totalFees.plus(_totalFees);
      totalTokenTransfers = totalTokenTransfers.plus(_totalTokenTransfers);
      totalNftTransfers = totalNftTransfers.plus(_totalNftTransfers);
      totalContractsTransfers = totalContractsTransfers.plus(_totalContractsTransfers);

      this.logger.log(`Finish computing page ${index}`);
    });

    const rewardsPerEpoch = await this.getCurrentRewardsPerEpoch();
    const newEmission = new BigNumber(rewardsPerEpoch).shiftedBy(18).minus(new BigNumber(totalFees));

    const activeAccounts = await this.cachingService.getSetMembersCount(TransactionsDetailedIngest.ACTIVE_ACCOUNTS_KEY);
    const activeContracts = await this.cachingService.getSetMembersCount(TransactionsDetailedIngest.ACTIVE_CONTRACTS_KEY);
    const activeTokens = await this.cachingService.getSetMembersCount(TransactionsDetailedIngest.ACTIVE_TOKENS_KEY);
    const activeNfts = await this.cachingService.getSetMembersCount(TransactionsDetailedIngest.ACTIVE_NFT_COLLECTIONS_KEY);

    await this.deleteSetKeys();

    const data = {
      accounts: {
        active_accounts: activeAccounts,
      },
      contracts: {
        active_contracts: activeContracts,
        transfers: totalContractsTransfers.toNumber(),
      },
      tokens: {
        active_tokens: activeTokens,
        transfers: totalTokenTransfers.toNumber(),
      },
      nfts: {
        active_nfts: activeNfts,
        transfers: totalNftTransfers.toNumber(),
      },
      transactions: {
        value_moved: valueMoved.shiftedBy(-18).toNumber(),
        total_fees: totalFees.shiftedBy(-18).toNumber(),
        new_emission: newEmission.shiftedBy(-18).toNumber(),
      },
    };
    return [{
      entity: TransactionsDetailedEntity,
      records: TransactionsDetailedEntity.fromObject(startDate.toDate(), data),
    }];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async computeTransactionsPage(transactions: any[]): Promise<BigNumber[]> {
    let valueMoved = new BigNumber(0);
    let totalFees = new BigNumber(0);
    let totalTokenTransfers = new BigNumber(0);
    let totalNftTransfers = new BigNumber(0);
    let totalContractsTransfers = new BigNumber(0);

    for (const transaction of transactions) {
      valueMoved = valueMoved.plus(new BigNumber(transaction.value?.length > 0 ? transaction.value : '0'));
      totalFees = totalFees.plus(new BigNumber(transaction.fee?.length > 0 ? transaction.fee : '0'));

      await this.cachingService.addInSet(TransactionsDetailedIngest.ACTIVE_ACCOUNTS_KEY, transaction.sender);

      const { tokens, nfts, contracts } = await this.transactionsService.getTransactionTransfers(transaction);

      totalTokenTransfers = totalTokenTransfers.plus(new BigNumber(tokens.length));
      totalNftTransfers = totalNftTransfers.plus(new BigNumber(nfts.length));
      totalContractsTransfers = totalContractsTransfers.plus(new BigNumber(contracts.length));

      for (const token of tokens) {
        await this.cachingService.addInSet(TransactionsDetailedIngest.ACTIVE_TOKENS_KEY, token);
      }
      for (const nft of nfts) {
        await this.cachingService.addInSet(TransactionsDetailedIngest.ACTIVE_NFT_COLLECTIONS_KEY, nft);
      }
      for (const contract of contracts) {
        await this.cachingService.addInSet(TransactionsDetailedIngest.ACTIVE_CONTRACTS_KEY, contract);
      }
    }

    return [valueMoved, totalFees, totalTokenTransfers, totalNftTransfers, totalContractsTransfers];
  }

  private async deleteSetKeys() {
    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_ACCOUNTS_KEY);
    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_TOKENS_KEY);
    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_NFT_COLLECTIONS_KEY);
    await this.cachingService.delCache(TransactionsDetailedIngest.ACTIVE_CONTRACTS_KEY);
  }

  private async getCurrentRewardsPerEpoch(): Promise<number> {
    const epoch = await this.gatewayService.getEpoch();
    const config = await this.gatewayService.getNetworkConfig();

    const epochDuration = config.roundDuration * config.roundsPerEpoch;
    const secondsInYear = 365 * 24 * 3600;
    const epochsInYear = secondsInYear / epochDuration;
    const yearIndex = Math.floor(epoch / epochsInYear);
    const inflationAmounts = this.apiConfigService.getInflationAmounts();

    if (yearIndex >= inflationAmounts.length) {
      throw new Error(
        `There is no inflation information for year with index ${yearIndex}`,
      );
    }

    const inflation = inflationAmounts[yearIndex];
    const rewardsPerEpoch = Math.max(inflation / epochsInYear, 0);
    return rewardsPerEpoch;
  }
}
