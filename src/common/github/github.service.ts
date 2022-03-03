import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "../api-config/api.config.service";
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";

@Injectable()
export class GithubService {
  private readonly octokit: Octokit;

  constructor(
    private readonly apiConfigService: ApiConfigService,
  ) {
    const MyOctokit = Octokit.plugin(throttling);
    this.octokit = new MyOctokit({
      auth: this.apiConfigService.getGithubAccessToken(),
      throttle: {
        onRateLimit: (retryAfter: number, options: any, octokit: any) => {
          octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

          if (options.request.retryCount === 0) {
            octokit.log.info(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
          return false;
        },
        onAbuseLimit: (retryAfter: number, options: any, octokit: any) => {
          octokit.log.warn(
            `Abuse detected for request ${options.method} ${options.url}. Retry after ${retryAfter}`
          );
        },
      },
    });

  }

  public async getOrganizationRepositories(organization: string): Promise<string[]> {
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

  public async getLastCommits(organization: string, repository: string, startDate: moment.Moment): Promise<any> {
    const branches = await this.octokit.paginate('GET /repos/{owner}/{repo}/branches?per_page=100', {
      owner: organization,
      repo: repository,
    });
    const lastRepositoryCommits = await Promise.all(branches.map(async (branch: any) => {
      const lastBranchCommits = await this.octokit.paginate(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner: organization,
          repo: repository,
          since: startDate.format(),
          sha: branch.name,
          per_page: 100,
        },
        (response) => response.data.map((commit) => commit.sha)
      );

      await new Promise((res) => setTimeout(res, 10000));

      return lastBranchCommits.distinct();
    }));

    const distinctLastRepositoryCommits = lastRepositoryCommits
      .flat(1)
      .distinct();

    return distinctLastRepositoryCommits;
  }
}
