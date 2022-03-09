import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { GithubEntity } from "src/common/timescale/entities/github.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class GithubIngest implements Ingest {
  public readonly name = GithubIngest.name;
  public readonly entityTarget = GithubEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const repoDetails: any = {};

    let totalStars = 0;
    let totalCommits = 0;
    const totalAuthors = new Set<string>();

    let featuredStars = 0;
    let featuredCommits = 0;
    const featuredAuthors = new Set<string>();

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    const repositories = await this.githubService.getRepositories(organization);

    for (const repository of repositories) {
      const stars = await this.githubService.getRepositoryStars(organization, repository);

      totalStars += stars;
      if (featuredRepositories.includes(repository)) {
        featuredStars += stars;
      }

      const contributors = await this.githubService.getRepositoryContributors(organization, repository);
      contributors.map((contributor) => {
        totalAuthors.add(contributor.author);
        totalCommits += contributor.commits;
      });

      if (featuredRepositories.includes(repository)) {
        let commits = 0;
        contributors.map((contributor) => {
          featuredAuthors.add(contributor.author);
          commits += contributor.commits;
          featuredCommits += contributor.commits;
        });

        const formattedRepoName = repository.replace(/-/g, '_');
        repoDetails[formattedRepoName] = {
          commits: commits,
          stars: stars,
          contributors: contributors.length,
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    repoDetails['total'] = {
      commits: totalCommits,
      stars: totalStars,
      contributors: totalAuthors.size,
    };

    repoDetails['featured'] = {
      commits: featuredCommits,
      stars: featuredStars,
      contributors: featuredAuthors.size,
    };

    return {
      current: {
        entity: GithubEntity,
        records: GithubEntity.fromObject(timestamp, repoDetails),
      },
    };
  }
}
