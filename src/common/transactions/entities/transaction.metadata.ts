import { TransactionMetadataTransfer } from "./transaction.metadata.transfer";

export class TransactionMetadata {
  sender: string = '';
  receiver: string = '';
  functionName?: string;
  functionArgs: string[] = [];
  transfers: TransactionMetadataTransfer[] = [];
}
