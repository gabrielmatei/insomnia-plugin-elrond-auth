import { Logger } from "@nestjs/common";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ApiService } from "src/common/network/api.service";
import { GenericIngestEntity } from "src/ingesters/generic/generic-ingest.entity";
import { Ingest } from "./ingest";

export class GithubIngest implements Ingest {
  private readonly logger: Logger;

  private readonly apiConfigService: ApiConfigService;
  private readonly apiService: ApiService;

  constructor(apiConfigService: ApiConfigService, apiService: ApiService) {
    this.apiConfigService = apiConfigService;
    this.apiService = apiService;

    this.logger = new Logger(GithubIngest.name);
  }

  public async fetch(): Promise<GenericIngestEntity[]> {
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

          // const previousResult24h = await previousValue24h(
          //   'github',
          //   formattedRepoName,
          //   'commits'
          // );
          // let commits_24h = 0;
          // if (previousResult24h.Rows.length) {
          //   const {
          //     Rows: [
          //       {
          //         Data: [{ ScalarValue: repo_last_24h }],
          //       },
          //     ],
          //   } = previousResult24h;
          //   const new_commits = repo_last_24h > 0 ? commits - repo_last_24h : 0;
          //   commits_24h = new_commits > 0 ? new_commits : 0;
          // }

          const formattedRepoName = repository.replace(/-/g, '_');
          repoDetails[formattedRepoName] = {
            commits: commits,
            // commits_24h: commits_24h,
            stars: stars,
            contributors: contributors.length,
          };
        }

      })
    );

    // const previousResult24h = await previousValue24h('github', 'total', 'commits');
    // let commits_24h = 0;
    // if (previousResult24h.Rows.length) {
    //   const {
    //     Rows: [
    //       {
    //         Data: [{ ScalarValue: total_last_24h }],
    //       },
    //     ],
    //   } = previousResult24h;
    //   if (totalCommits < total_last_24h) {
    //     totalCommits = total_last_24h;
    //   }
    //   const newCommits = total_last_24h > 0 ? totalCommits - total_last_24h : 0;
    //   commits_24h = newCommits > 0 ? newCommits : 0;
    // }
    // repoDetails['total'] = {
    //   commits_24h: commits_24h,
    // };

    // const featuredResult24h = await previousValue24h('github', 'featured', 'commits');
    // let featured_commits_24h = 0;
    // if (featuredResult24h.Rows.length) {
    //   const {
    //     Rows: [
    //       {
    //         Data: [{ ScalarValue: featured_last_24h }],
    //       },
    //     ],
    //   } = featuredResult24h;
    //   if (featuredCommits < featured_last_24h) {
    //     featuredCommits = featured_last_24h;
    //   }
    //   const newCommits = featured_last_24h > 0 ? featuredCommits - featured_last_24h : 0;
    //   featured_commits_24h = newCommits > 0 ? newCommits : 0;
    // }
    // repoDetails['featured'] = {
    //   commits_24h: featured_commits_24h,
    // };


    repoDetails['total']['commits'] = totalCommits;
    repoDetails['total']['stars'] = totalStars;
    repoDetails['total']['contributors'] = totalAuthors.size;

    repoDetails.featured['commits'] = featuredCommits;
    repoDetails.featured['stars'] = featuredStars;
    repoDetails.featured['contributors'] = featuredAuthors.size;

    console.log(repoDetails);
    return [];

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
