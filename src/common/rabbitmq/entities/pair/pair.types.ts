import { GenericTokenType } from "../generic.token";
import { GenericEventType } from "../generic.types";

export type SwapEventType = GenericEventType & {
  tokenIn: GenericTokenType;
  tokenOut: GenericTokenType;
  feeAmount: string;
  tokenInReserves: string;
  tokenOutReserves: string;
};
