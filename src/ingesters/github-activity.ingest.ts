import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { GithubActivityEntity } from "./entities/github-activity.entity";

@Injectable()
export class GithubActivityIngest implements Ingest {
  public readonly name = GithubActivityIngest.name;
  public readonly entityTarget = GithubActivityEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<GithubActivityEntity[]> {
    const timestamp = moment().utc().toDate();
    const startDate = moment().startOf('day');

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    const repoDetails: any = {};
    let lastTotalCommits: string[] = [];
    let lastFeaturedCommits: string[] = [];

    const repositories = await this.githubService.getOrganizationRepositories(organization);

    await Promise.all(repositories.map(async (repository) => {
      const lastCommits = await this.githubService.getLastCommits(organization, repository, startDate);

      lastTotalCommits.push(...lastCommits);
      lastTotalCommits = lastTotalCommits.distinct();

      if (featuredRepositories.includes(repository)) {
        lastFeaturedCommits.push(...lastCommits);
        lastFeaturedCommits = lastFeaturedCommits.distinct();

        repoDetails[repository] = {
          commits_24h: lastCommits.length,
        };
      }
    }));

    repoDetails['total'] = {
      commits_24h: lastTotalCommits.length,
    };
    repoDetails['featured'] = {
      commits_24h: lastFeaturedCommits.length,
    };
    return GithubActivityEntity.fromObject(timestamp, repoDetails);
  }
}
