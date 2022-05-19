import { Injectable } from "@nestjs/common";
import { CachingService } from "src/common/caching/caching.service";
import { CacheInfo } from "src/common/caching/entities/cache.info";
import { JobType } from "./entities/job.type";

@Injectable()
export class JobsService {
  constructor(private readonly cachingService: CachingService) { }

  public async runJob(jobType: JobType): Promise<string> {
    await this.cachingService.setCacheRemote(
      CacheInfo.ScheduledJob(jobType).key,
      jobType,
      CacheInfo.ScheduledJob(jobType).ttl,
    );

    return `${jobType} is scheduled to run in ~5 minutes`;
  }
}
