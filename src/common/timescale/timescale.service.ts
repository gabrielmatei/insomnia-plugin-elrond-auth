import { Injectable, Logger } from '@nestjs/common';
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

  public async writeData(tableName: string, key: string, value: number, time: string): Promise<void> {
    try {
      const entityManager = getManager();
      await entityManager.query(`INSERT INTO ${tableName}(time, key, value) VALUES('${time}', '${key}', ${value});`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
