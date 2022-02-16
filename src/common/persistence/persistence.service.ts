import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Constants } from 'src/utils/constants';
import { getManager } from 'typeorm';

@Injectable()
export class PersistenceService {
  private readonly TableName: string;

  private readonly logger: Logger;

  constructor(
  ) {
    this.logger = new Logger(PersistenceService.name);

    this.TableName = 'test_hyper';
  }

  public async readData(key: string): Promise<any[]> {
    try {
      const entityManager = getManager();
      const rawData = await entityManager.query(`SELECT * FROM ${this.TableName} WHERE key = '${key}';`);
      return rawData;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  public async writeDate(key: string, value: number): Promise<void> {
    try {
      const currentTime = moment().utc().format(Constants.sqlDateFormat());

      const entityManager = getManager();
      await entityManager.query(`INSERT INTO ${this.TableName}(time, value, key) VALUES('${currentTime}', ${value}, '${key}');`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
