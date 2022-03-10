import { Injectable } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { GithubService } from "src/common/github/github.service";
import { GithubActivityEntity } from "src/common/timescale/entities/github-activity.entity";
import { Ingest } from "src/crons/data-ingester/entities/ingest.interface";
import { IngestResponse } from "src/crons/data-ingester/entities/ingest.response";

@Injectable()
export class GithubContributorsIngest implements Ingest {
  public readonly name = GithubContributorsIngest.name;
  public readonly entityTarget = GithubActivityEntity;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly githubService: GithubService,
  ) { }

  public async fetch(): Promise<IngestResponse> {
    const timestamp = moment.utc().toDate();

    const repoDetails: any = {};

    let totalStars = 0;
    let featuredStars = 0;
    const totalAuthors = new Set<string>();
    const featuredAuthors = new Set<string>();

    const organization = 'ElrondNetwork';
    const featuredRepositories = this.apiConfigService.getFeaturedGithubRepositories();

    const repositories = await this.githubService.getRepositories(organization);
    for (const repository of repositories) {
      const stars = await this.githubService.getRepositoryStars(organization, repository);
      const contributors = await this.githubService.getRepositoryContributors(organization, repository);

      totalStars += stars;
      contributors.map((contributor) => {
        totalAuthors.add(contributor.author);
      });

      if (featuredRepositories.includes(repository)) {
        featuredStars += stars;
        contributors.map((contributor) => {
          featuredAuthors.add(contributor.author);
        });

        repoDetails[repository] = {
          contributors: contributors.length,
          stars: stars,
        };
      }

      await new Promise(resolve => setTimeout(resolve, GithubService.DELAY));
    }

    repoDetails['total'] = {
      contributors: totalAuthors.size,
      stars: totalStars,
    };
    repoDetails['featured'] = {
      contributors: featuredAuthors.size,
      stars: featuredStars,
    };

    return {
      historical: {
        entity: GithubActivityEntity,
        records: GithubActivityEntity.fromObject(timestamp, repoDetails),
      },
    };
  }
}
