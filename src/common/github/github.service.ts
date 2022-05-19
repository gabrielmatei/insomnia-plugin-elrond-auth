import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "../api-config/api.config.service";
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { CacheInfo } from "../caching/entities/cache.info";
import { CachingService } from "../caching/caching.service";

@Injectable()
export class GithubService {
  public static readonly DELAY = 1500;

  private readonly logger: Logger;
  private readonly octokit: Octokit;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly cachingService: CachingService,
  ) {
    this.logger = new Logger(GithubService.name);

    const MyOctokit = Octokit.plugin(throttling);
    this.octokit = new MyOctokit({
      auth: this.apiConfigService.getGithubAccessToken(),
      throttle: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRateLimit: (retryAfter: number, options: any) => {
          this.logger.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

          if (options.request.retryCount === 0) {
            this.logger.log(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
          return false;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAbuseLimit: (retryAfter: number, options: any) => {
          this.logger.warn(`Abuse detected for request ${options.method} ${options.url}. Retry after ${retryAfter}`);
        },
      },
    });
  }

  async getRepositories(organization: string): Promise<string[]> {
    return await this.cachingService.getOrSetCache(
      CacheInfo.Repositories(organization).key,
      async () => await this.getRepositoriesRaw(organization),
      CacheInfo.Repositories(organization).ttl,
    );
  }

  public async getRepositoriesRaw(organization: string): Promise<string[]> {
    const repositories = await this.octokit.paginate(
      'GET /orgs/{org}/repos',
      {
        org: organization,
        per_page: 100,
      },
      (response) => response.data.map((repository) => repository.name),
    );
    return repositories;
  }

  public async getCommits(organization: string, repository: string): Promise<any[]> {
    const commits = await this.octokit.paginate('GET /repos/{owner}/{repo}/commits', {
      owner: organization,
      repo: repository,
      per_page: 100,
    });
    return commits;
  }

  public async getLastCommits(organization: string, repository: string, startDate: moment.Moment, endDate: moment.Moment): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const branches: any[] = await this.octokit.paginate('GET /repos/{owner}/{repo}/branches?per_page=100', {
      owner: organization,
      repo: repository,
    });

    const lastRepositoryCommits: string[][] = [];
    for (const branch of branches) {
      const lastBranchCommits = await this.octokit.paginate(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner: organization,
          repo: repository,
          since: startDate.format(),
          until: endDate.format(),
          sha: branch.name,
          per_page: 100,
        },
        (response) => response.data.map((commit) => commit.sha)
      );

      await new Promise(resolve => setTimeout(resolve, GithubService.DELAY));

      lastRepositoryCommits.push(lastBranchCommits.distinct());
    }

    const distinctLastRepositoryCommits = lastRepositoryCommits
      .flat(1)
      .distinct();

    return distinctLastRepositoryCommits;
  }

  public async getRepositoryStars(organization: string, repository: string): Promise<number> {
    const {
      data: { stargazers_count },
    } = await this.octokit.request('GET /repos/{owner}/{repo}', {
      owner: organization,
      repo: repository,
    });
    return stargazers_count;
  }

  public async getRepositoryContributors(organization: string, repository: string): Promise<{ author: string, commits: number }[]> {
    const contributorsRaw = await this.octokit.paginate(
      'GET /repos/{owner}/{repo}/contributors',
      {
        owner: organization,
        repo: repository,
      },
      (response) => response.data.map((item) => ({
        author: item.login,
        commits: item.contributions,
      }))
    );

    const contributors = contributorsRaw
      .filter((contributor): contributor is { author: string, commits: number } => contributor !== null);
    return contributors;
  }
}
