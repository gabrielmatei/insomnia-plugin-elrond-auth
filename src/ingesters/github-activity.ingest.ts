import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { GithubActivityEntity } from "src/common/timescale/entities/github-activity.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestRecords } from "src/crons/data-ingester/entities/ingest.records";

@Injectable()
export class GithubActivityIngest implements Ingest {
  public readonly name = GithubActivityIngest.name;
  public readonly entityTarget = GithubActivityEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<IngestRecords[]> {
    const endDate = moment.utc().startOf('day');
    const startDate = moment(endDate).add(-1, 'days');

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repoDetails: any = {};
    let lastTotalCommits: string[] = [];
    let lastFeaturedCommits: string[] = [];

    const repositories = await this.githubService.getRepositories(organization);
    for (const repository of repositories) {
      const lastCommits = await this.githubService.getLastCommits(organization, repository, startDate, endDate);

      lastTotalCommits.push(...lastCommits);
      lastTotalCommits = lastTotalCommits.distinct();

      if (featuredRepositories.includes(repository)) {
        lastFeaturedCommits.push(...lastCommits);
        lastFeaturedCommits = lastFeaturedCommits.distinct();

        repoDetails[repository] = {
          commits_24h: lastCommits.length,
        };
      }

      await new Promise(resolve => setTimeout(resolve, GithubService.DELAY));
    }

    repoDetails['total'] = {
      commits_24h: lastTotalCommits.length,
    };
    repoDetails['featured'] = {
      commits_24h: lastFeaturedCommits.length,
    };

    return [{
      entity: GithubActivityEntity,
      records: GithubActivityEntity.fromObject(startDate.toDate(), repoDetails),
    }];
  }
}
