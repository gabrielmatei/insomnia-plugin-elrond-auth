import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { GithubActivityEntity } from "src/common/timescale/entities/github-activity.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class GithubCommitsIngest implements Ingest {
  public readonly name = GithubCommitsIngest.name;
  public readonly entityTarget = GithubActivityEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    const repoDetails: any = {};
    let totalCommits = 0;
    let featuredCommits = 0;

    const repositories = await this.githubService.getRepositories(organization);
    for (const repository of repositories) {
      const commits = await this.githubService.getCommits(organization, repository);

      totalCommits += commits.length;

      if (featuredRepositories.includes(repository)) {
        featuredCommits += commits.length;

        repoDetails[repository] = {
          commits: commits.length,
        };
      }

      await new Promise(resolve => setTimeout(resolve, GithubService.DELAY));
    }

    repoDetails['total'] = {
      commits: totalCommits + featuredCommits,
    };
    repoDetails['featured'] = {
      commits: featuredCommits,
    };

    return {
      historical: {
        entity: GithubActivityEntity,
        records: GithubActivityEntity.fromObject(timestamp, repoDetails),
      },
    };
  }
}
