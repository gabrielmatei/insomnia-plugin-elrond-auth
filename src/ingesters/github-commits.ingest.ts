import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { GithubActivityEntity } from "src/common/timescale/entities/github-activity.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";

@Injectable()
export class GithubCommitsIngest implements Ingest {
  public readonly name = GithubCommitsIngest.name;
  public readonly entityTarget = GithubActivityEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<GithubActivityEntity[]> {
    const timestamp = moment().utc().toDate();

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    const repoDetails: any = {};
    let totalCommits = 0;
    let featuredCommits = 0;

    const repositories = await this.githubService.getRepositories(organization);
    await Promise.all(repositories.map(async (repository) => {
      const commits = await this.githubService.getCommits(organization, repository);

      totalCommits += commits.length;

      if (featuredRepositories.includes(repository)) {
        featuredCommits += commits.length;

        repoDetails[repository] = {
          commits: commits.length,
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }));

    repoDetails['total'] = {
      commits: totalCommits + featuredCommits,
    };
    repoDetails['featured'] = {
      commits: featuredCommits,
    };

    return GithubActivityEntity.fromObject(timestamp, repoDetails);
  }
}
