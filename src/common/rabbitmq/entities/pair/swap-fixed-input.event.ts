import { AddressType, BigUIntType, BinaryCodec, FieldDefinition, StructType, TokenIdentifierType, U64Type } from "@elrondnetwork/erdjs/out";
import BigNumber from "bignumber.js";
import { GenericEvent } from "../generic.event";
import { GenericToken } from "../generic.token";
import { PairEventTopics } from "./pair.event.topics";
import { SwapEventType } from "./pair.types";
import * as crypto from "crypto";

export class SwapFixedInputEvent extends GenericEvent {
  private decodedTopics: PairEventTopics;

  private tokenIn: GenericToken = new GenericToken();
  private tokenOut: GenericToken = new GenericToken();
  feeAmount!: BigNumber;
  tokenInReserves!: BigNumber;
  tokenOutReserves!: BigNumber;

  constructor(init?: Partial<GenericEvent>) {
    super(init);
    this.decodedTopics = new PairEventTopics(this.topics);

    if (this.decodedTopics.getEventName() !== 'swap') {
      return;
    }

    const decodedEvent = this.decodeEvent();

    Object.assign(this, decodedEvent);
    this.tokenIn = new GenericToken({
      tokenID: decodedEvent.tokenInID.toString(),
      amount: decodedEvent.tokenInAmount,
    });
    this.tokenOut = new GenericToken({
      tokenID: decodedEvent.tokenOutID.toString(),
      amount: decodedEvent.tokenOutAmount,
    });
  }

  getTokenIn(): GenericToken {
    return this.tokenIn;
  }

  getTokenOut(): GenericToken {
    return this.tokenOut;
  }

  getTokenInReserves(): BigNumber {
    return this.tokenInReserves;
  }

  getTokenOutReserves(): BigNumber {
    return this.tokenOutReserves;
  }

  toJSON(): SwapEventType {
    return {
      ...super.toJSON(),
      tokenIn: this.tokenIn.toJSON(),
      tokenOut: this.tokenOut.toJSON(),
      feeAmount: this.feeAmount.toFixed(),
      tokenInReserves: this.tokenInReserves.toFixed(),
      tokenOutReserves: this.tokenOutReserves.toFixed(),
    };
  }

  getEventName() {
    return this.decodedTopics.getEventName();
  }

  getTopics() {
    return this.decodedTopics.toPlainObject();
  }

  getDatabaseIdentifier(): string {
    const keys = [];
    keys.push(
      this.getTimestamp().toString(),
      this.getIdentifier(),
      ...this.topics
    );
    const keysConcat = JSON.stringify(keys.join('_'));

    const hash = crypto.createHash('md5').update(keysConcat).digest('base64url');
    return hash;
  }

  private decodeEvent() {
    const data = Buffer.from(this.data, 'base64');
    const codec = new BinaryCodec();

    const swapEventStructure = this.getStructure();

    const [decoded] = codec.decodeNested(data, swapEventStructure);

    return decoded.valueOf();
  }

  private getStructure(): StructType {
    return new StructType('SwapEvent', [
      new FieldDefinition('caller', '', new AddressType()),
      new FieldDefinition('tokenInID', '', new TokenIdentifierType()),
      new FieldDefinition('tokenInAmount', '', new BigUIntType()),
      new FieldDefinition('tokenOutID', '', new TokenIdentifierType()),
      new FieldDefinition('tokenOutAmount', '', new BigUIntType()),
      new FieldDefinition('feeAmount', '', new BigUIntType()),
      new FieldDefinition('tokenInReserves', '', new BigUIntType()),
      new FieldDefinition('tokenOutReserves', '', new BigUIntType()),
      new FieldDefinition('block', '', new U64Type()),
      new FieldDefinition('epoch', '', new U64Type()),
      new FieldDefinition('timestamp', '', new U64Type()),
    ]);
  }
}
