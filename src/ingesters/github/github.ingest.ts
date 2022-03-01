import { Logger } from "@nestjs/common";
import moment from "moment";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { Ingest } from "src/crons/data-ingester/ingester";
import { Github } from "./github.entity";

export class GithubIngest implements Ingest {
  private readonly logger: Logger;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;

    this.logger = new Logger(GithubIngest.name);
  }

  public async fetch(): Promise<Github[]> {
    const featuredRepositories = this.apiConfigService.getFeaturedRepositories();

    const repoDetails: any = {};

    let totalStars = 0;
    let totalCommits = 0;
    const totalAuthors = new Set<string>();

    let featuredStars = 0;
    let featuredCommits = 0;
    const featuredAuthors = new Set<string>();

    const repositories = await this.getGithubRepositories();

    await Promise.all(
      repositories.map(async (repository) => {
        const stars = await this.getRepositoryStars(repository);

        totalStars += stars;
        if (featuredRepositories.includes(repository)) {
          featuredStars += stars;
        }

        const contributors = await this.getRepositoryContributors(repository);
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

      })
    );

    repoDetails['total'] = {};
    repoDetails['total']['commits'] = totalCommits;
    repoDetails['total']['stars'] = totalStars;
    repoDetails['total']['contributors'] = totalAuthors.size;

    repoDetails['featured'] = {};
    repoDetails['featured']['commits'] = featuredCommits;
    repoDetails['featured']['stars'] = featuredStars;
    repoDetails['featured']['contributors'] = featuredAuthors.size;

    const timestamp = moment().utc().toDate();
    return Github.fromObject(timestamp, repoDetails);
  }

  private async getGithubRepositories(): Promise<string[]> {
    const repositoriesRaw = await this.apiService.get<any[]>(
      'https://api.github.com/orgs/ElrondNetwork/repos',
      {
        headers: {
          Authorization: `token ${this.apiConfigService.getGithubAccessToken()}`,
        },
      });

    const repositories = repositoriesRaw
      .filter(repository => repository.name)
      .map(repository => repository.name as string);
    return repositories;
  }

  private async getRepositoryStars(repository: string): Promise<number> {
    try {
      const { stargazers_count } = await this.apiService.get(
        `https://api.github.com/repos/ElrondNetwork/${repository}`,
        {
          headers: {
            Authorization: `token ${this.apiConfigService.getGithubAccessToken()}`,
          },
        });
      return stargazers_count;
    } catch (error) {
      this.logger.error(error);
      return 0;
    }
  }

  private async getRepositoryContributors(repository: string): Promise<{ author: string, commits: number }[]> {
    try {
      const contributorsRaw = await this.apiService.get<any[]>(
        `https://api.github.com/repos/ElrondNetwork/${repository}/stats/contributors`,
        {
          headers: {
            Authorization: `token ${this.apiConfigService.getGithubAccessToken()}`,
          },
        });

      const contributors = contributorsRaw.map(contributor => ({
        author: contributor.author.login,
        commits: contributor.total,
      }));
      return contributors;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }
}