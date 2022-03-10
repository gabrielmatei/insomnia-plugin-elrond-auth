import { Injectable, Logger } from "@nestjs/common";
import { AddressUtils } from "src/utils/address.utils";
import { BinaryUtils } from "src/utils/binary.utils";
import { StringUtils } from "src/utils/string.utils";
import { ApiConfigService } from "../api-config/api.config.service";
import { CachingService } from "../caching/caching.service";
import { CacheInfo } from "../caching/entities/cache.info";
import { ApiService } from "../network/api.service";
import { TransactionMetadata } from "./entities/transaction.metadata";
import { TransactionType } from "./entities/transaction.type";

@Injectable()
export class TransactionsService {
  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly apiService: ApiService,
    private readonly cachingService: CachingService,
  ) {
    this.logger = new Logger(TransactionsService.name);
  }

  public async getTransactionTransfers(transaction: any): Promise<{ tokens: string[], nfts: string[], contracts: string[] }> {
    const tokens = [];
    const nfts = [];
    const contracts = [];

    const metadata = await this.getTransactionMetadata(transaction);

    if (AddressUtils.isSmartContractAddress(metadata.sender)) {
      contracts.push(metadata.sender);
    }

    if (metadata.functionName === 'ESDTTransfer') {
      for (const transfer of metadata.transfers) {
        tokens.push(transfer.identifier);
      }
    }

    if (metadata.functionName === 'ESDTNFTTransfer') {
      for (const transfer of metadata.transfers) {
        if (transfer.collection) {
          const isNft = await this.cachingService.getOrSetCache(
            CacheInfo.NftCollection(transfer.collection).key,
            async () => await this.isNftCollection(transfer.identifier),
            CacheInfo.NftCollection(transfer.collection).ttl
          );

          if (isNft) {
            nfts.push(transfer.collection);
          }
        }
      }
    }

    if (metadata.functionName === 'MultiESDTNFTTransfer') {
      for (const transfer of metadata.transfers) {
        if (transfer.collection && transfer.nonce) {
          const isNft = await this.cachingService.getOrSetCache(
            CacheInfo.NftCollection(transfer.collection).key,
            async () => await this.isNftCollection(transfer.identifier),
            CacheInfo.NftCollection(transfer.collection).ttl
          );

          if (isNft) {
            nfts.push(transfer.collection);
          }
        }
        else {
          tokens.push(transfer.identifier);
        }
      }
    }

    return { tokens, nfts, contracts };
  }

  private async isNftCollection(identifier: string): Promise<boolean> {
    try {
      const nftResponse = await this.apiService.get<any>(`${this.apiConfigService.getApiUrl()}/nfts/${identifier}`);

      if (nftResponse?.hasOwnProperty('uris')) {
        return true;
      }
    } catch (error) {
      this.logger.error(`Unhandled error checking if an identifier is NFT`);
      this.logger.error(error);
    }

    return false;
  }

  private async getTransactionMetadata(transaction: any): Promise<TransactionMetadata> {
    const metadata = this.getNormalTransactionMetadata(transaction);

    const esdtMetadata = await this.getEsdtTransactionMetadata(metadata);
    if (esdtMetadata) {
      return esdtMetadata;
    }

    const nftMetadata = await this.getNftTransferMetadata(metadata);
    if (nftMetadata) {
      return nftMetadata;
    }

    const multiMetadata = await this.getMultiTransferMetadata(metadata);
    if (multiMetadata) {
      return multiMetadata;
    }

    return metadata;
  }

  private getNormalTransactionMetadata(transaction: any): TransactionMetadata {
    const metadata = new TransactionMetadata();
    metadata.sender = transaction.sender;
    metadata.receiver = transaction.receiver;

    // TODO
    transaction.type = transaction.type === 'unsigned' ? TransactionType.SmartContractResult : TransactionType.Transaction;

    if (transaction.data) {
      const decodedData = BinaryUtils.base64Decode(transaction.data);

      const dataComponents = decodedData.split('@');

      const args = dataComponents.slice(1);
      if (args.all(x => this.isSmartContractArgument(x))) {
        metadata.functionName = dataComponents[0];
        metadata.functionArgs = args;
      }
    }

    try {
      if (transaction.type === TransactionType.SmartContractResult) {
        if (metadata.functionName === 'MultiESDTNFTTransfer' &&
          metadata.functionArgs.length > 0 &&
          AddressUtils.bech32Encode(metadata.functionArgs[0]) === metadata.receiver
        ) {
          metadata.receiver = metadata.sender;
        }

        if (metadata.functionName === 'ESDTNFTTransfer' &&
          metadata.functionArgs.length > 3 &&
          AddressUtils.bech32Encode(metadata.functionArgs[3]) === metadata.receiver
        ) {
          metadata.receiver = metadata.sender;
        }
      }
    } catch (error) {
      this.logger.error(`Unhandled error when interpreting MultiESDTNFTTransfer / ESDTNFTTransfer for a smart contract result`);
      this.logger.error(error);
    }

    return metadata;
  }

  private async getEsdtTransactionMetadata(metadata: TransactionMetadata): Promise<TransactionMetadata | undefined> {
    if (metadata.functionName !== 'ESDTTransfer') {
      return undefined;
    }

    const args = metadata.functionArgs;
    if (args.length < 2) {
      return undefined;
    }

    const tokenIdentifier = BinaryUtils.hexToString(args[0]);
    // const value = BinaryUtils.hexToBigInt(args[1]);

    const result = new TransactionMetadata();
    result.sender = metadata.sender;
    result.receiver = metadata.receiver;
    result.functionName = metadata.functionName;
    result.transfers = [{
      identifier: tokenIdentifier,
    }];

    return result;
  }

  private async getNftTransferMetadata(metadata: TransactionMetadata): Promise<TransactionMetadata | undefined> {
    if (metadata.sender !== metadata.receiver) {
      return undefined;
    }

    if (metadata.functionName !== 'ESDTNFTTransfer') {
      return undefined;
    }

    const args = metadata.functionArgs;
    if (args.length < 4) {
      return undefined;
    }

    if (!AddressUtils.isAddressValid(args[3])) {
      return undefined;
    }

    const collectionIdentifier = BinaryUtils.hexToString(args[0]);
    const nonce = args[1];
    // const value = BinaryUtils.hexToBigInt(args[2]);
    const receiver = AddressUtils.bech32Encode(args[3]);

    const result = new TransactionMetadata();
    result.sender = metadata.sender;
    result.receiver = receiver;
    result.functionName = metadata.functionName;
    result.transfers = [{
      collection: collectionIdentifier,
      identifier: `${collectionIdentifier}-${nonce}`,
    }];

    return result;
  }

  private async getMultiTransferMetadata(metadata: TransactionMetadata): Promise<TransactionMetadata | undefined> {
    if (metadata.sender !== metadata.receiver) {
      return undefined;
    }

    if (metadata.functionName !== 'MultiESDTNFTTransfer') {
      return undefined;
    }

    const args = metadata.functionArgs;
    if (args.length < 3) {
      return undefined;
    }

    if (!AddressUtils.isAddressValid(args[0])) {
      return undefined;
    }

    const receiver = AddressUtils.bech32Encode(args[0]);
    const transferCount = BinaryUtils.hexToNumber(args[1]);

    const result = new TransactionMetadata();
    if (!result.transfers) {
      result.transfers = [];
    }

    let index = 2;
    for (let i = 0; i < transferCount; i++) {
      const identifier = BinaryUtils.hexToString(args[index++]);
      const nonce = args[index++];
      index++; // const value = BinaryUtils.hexToBigInt(args[index++]);

      if (nonce) {
        result.transfers.push({
          collection: identifier,
          identifier: `${identifier}-${nonce}`,
          nonce: nonce,
        });
      } else {
        result.transfers.push({
          identifier: identifier,
        });
      }
    }

    result.sender = metadata.sender;
    result.receiver = receiver;
    result.functionName = metadata.functionName;

    return result;
  }

  private isSmartContractArgument(arg: string): boolean {
    if (!StringUtils.isHex(arg)) {
      return false;
    }

    if (arg.length % 2 !== 0) {
      return false;
    }

    return true;
  }

}
