import moment from "moment";
import { Constants } from "./constants";

export class DateUtils {
  static dateToSql(date: Date): string {
    return moment.utc(date).format(Constants.sqlDateFormat());
  }
}