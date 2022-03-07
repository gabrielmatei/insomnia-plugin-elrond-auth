import moment from "moment";

export class DateUtils {
  static timescaleToUtc(time: Date | string): string {
    return moment(time).utcOffset(0, true).toISOString();
  }
}
