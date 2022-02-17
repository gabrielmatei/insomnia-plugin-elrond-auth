import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Constants } from 'src/utils/constants';
import { getManager } from 'typeorm';

@Injectable()
export class TimescaleService {
  private readonly logger: Logger;

  constructor(
  ) {
    this.logger = new Logger(TimescaleService.name);
  }

  public async readData(tableName: string, key: string): Promise<any[]> {
    try {
      const entityManager = getManager();
      const rawData = await entityManager.query(`SELECT * FROM ${tableName} WHERE key = '${key}';`);
      return rawData;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  public async writeData(tableName: string, key: string, value: number, time?: string): Promise<void> {
    try {
      const currentTime = time ?? moment().utc().format(Constants.sqlDateFormat());

      const entityManager = getManager();
      await entityManager.query(`INSERT INTO ${tableName}(time, key, value) VALUES('${currentTime}', '${key}', ${value});`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
