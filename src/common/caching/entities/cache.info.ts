import { Constants } from "src/utils/constants";

export class CacheInfo {
  key: string = "";
  ttl: number = Constants.oneSecond() * 6;

  static Repositories(organization: string): CacheInfo {
    return {
      key: `repositories:${organization}`,
      ttl: Constants.oneHour(),
    };
  }
}
