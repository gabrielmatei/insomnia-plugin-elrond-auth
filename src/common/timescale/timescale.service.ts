import { Injectable, Logger } from '@nestjs/common';
import { EntityTarget, getManager, getRepository } from 'typeorm';

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

  public async writeData<T>(entityTarget: EntityTarget<T>, entity: T): Promise<void> {
    try {
      const repository = getRepository(entityTarget);
      await repository.save(entity);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
