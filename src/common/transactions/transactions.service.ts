import { TransactionDecoder, TransactionMetadataTransfer } from "@elrondnetwork/transaction-decoder";
import { Injectable, Logger } from "@nestjs/common";
import { AddressUtils } from "src/utils/address.utils";
import { ApiConfigService } from "../api-config/api.config.service";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { ApiService } from "../network/api.service";

@Injectable()
export class TransactionsService {
  private readonly logger: Logger;
  private readonly transactionDecoder: TransactionDecoder = new TransactionDecoder();

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly cachingService: CachingService,
  ) {
    this.logger = new Logger(TransactionsService.name);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getTransactionTransfers(transaction: any): Promise<{ tokens: string[], nfts: string[], contracts: string[] }> {
    const tokens: string[] = [];
    const nfts: string[] = [];
    const contracts: string[] = [];

    const metadata = this.transactionDecoder.getTransactionMetadata(transaction);

    if (AddressUtils.isSmartContractAddress(metadata.receiver)) {
      contracts.push(metadata.receiver);
    }

    const { transfers } = metadata;
    if (transfers) {
      for (const transfer of transfers) {
        if (transfer.properties?.token) {
          tokens.push(transfer.properties?.token);
        }

        const collection = await this.getNftCollection(transfer);
        if (collection) {
          nfts.push(collection);
        } else if (transfer.properties?.collection) {
          tokens.push(transfer.properties?.collection);
        } else if (transfer.properties?.identifier) {
          tokens.push(transfer.properties?.identifier);
        }
      }
    }

    return { tokens, nfts, contracts };
  }

  private async getNftCollection(transfer: TransactionMetadataTransfer): Promise<string | undefined> {
    if (!transfer.properties) {
      return undefined;
    }

    const { collection, identifier } = transfer.properties;
    if (!collection || !identifier) {
      return undefined;
    }

    const isNft = await this.cachingService.getOrSetCache(
      CacheInfo.NftCollection(collection).key,
      async () => await this.isNftCollection(identifier),
      CacheInfo.NftCollection(collection).ttl
    );

    return isNft
      ? transfer.properties.collection
      : undefined;
  }

  private async isNftCollection(identifier: string): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nftResponse = await this.apiService.get<any>(`${this.apiConfigService.getApiUrl()}/nfts/${identifier}`);

      if (nftResponse?.hasOwnProperty('uris')) {
        return true;
      }
    } catch {
      this.logger.error(`Unhandled error checking if an identifier is NFT`);
    }

    return false;
  }
}
