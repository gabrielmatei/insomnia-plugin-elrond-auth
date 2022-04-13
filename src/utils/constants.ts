import { EsdtToken } from "src/common/maiar-dex/entities/pair";

export class Constants {
  static oneSecond(): number {
    return 1;
  }

  static oneMinute(): number {
    return Constants.oneSecond() * 60;
  }

  static oneHour(): number {
    return Constants.oneMinute() * 60;
  }

  static oneDay(): number {
    return Constants.oneHour() * 24;
  }

  static oneWeek(): number {
    return Constants.oneDay() * 7;
  }

  static oneMonth(): number {
    return Constants.oneDay() * 30;
  }

  static sqlDateFormat(): string {
    return 'yyyy-MM-DD HH:mm:ss';
  }

  // TODO mainnet tokens
  static WrappedEGLD: EsdtToken = {
    identifier: "WEGLD-d7c6bb", // "WEGLD-bd4d79"
    name: "WrappedEGLD",
    decimals: 18,
  };

  static WrappedUSDC: EsdtToken = {
    identifier: "USDC-8d4068", // "USDC-c76f1f"
    name: "WrappedUSDC",
    decimals: 6,
  };
}
