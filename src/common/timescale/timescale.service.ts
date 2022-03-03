import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { GenericIngestEntity } from 'src/ingesters/generic/generic-ingest.entity';
import { EntityTarget, getRepository } from 'typeorm';

@Injectable()
export class TimescaleService {
  private readonly logger: Logger;

  constructor(
  ) {
    this.logger = new Logger(TimescaleService.name);
  }

  public async writeData<T>(entityTarget: EntityTarget<T>, entity: T | T[]): Promise<void> {
    try {
      const repository = getRepository(entityTarget);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await repository.save(entity);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async getPreviousValue24h<T extends GenericIngestEntity>(entityTarget: EntityTarget<T>, currentTimestamp: Date, key: string, series?: string): Promise<number | undefined> {
    const repository = getRepository(entityTarget);

    let query = repository
      .createQueryBuilder()
      .where('key = :key')
      .andWhere('timestamp >= :ago24h')
      .setParameters({
        key,
        series,
        now: currentTimestamp.toISOString(),
        ago24h: moment.utc(currentTimestamp).add(-1, 'days').toISOString(),
      })
      .orderBy('timestamp', 'ASC')
      .limit(1);

    if (series) {
      query = query.andWhere('series = :series');
    }

    const entity = await query.getOne();
    if (!entity) {
      return undefined;
    }
    return entity.value;
  }
}
