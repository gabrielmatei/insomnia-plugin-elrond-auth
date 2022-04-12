import { Address } from '@elrondnetwork/erdjs/out';
import BigNumber from 'bignumber.js';
import { GenericEventType } from './generic.types';

export class GenericEvent {
  private address = '';
  private identifier = '';
  protected topics = [];
  protected data = '';

  protected caller!: Address;
  protected block!: BigNumber;
  protected epoch!: BigNumber;
  protected timestamp!: BigNumber;

  constructor(init?: Partial<GenericEvent>) {
    Object.assign(this, init);
  }

  getAddress(): string {
    return this.address;
  }

  getIdentifier(): string {
    return this.identifier;
  }

  getTimestamp(): BigNumber {
    return this.timestamp;
  }

  toJSON(): GenericEventType {
    return {
      address: this.address,
      caller: this.caller.toString(),
      block: this.block.toNumber(),
      epoch: this.epoch.toNumber(),
      timestamp: this.timestamp.toNumber(),
    };
  }
}
