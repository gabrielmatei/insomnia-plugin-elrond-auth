import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FeaturedRepositoryEnum } from './models/featured-repository.enum';
import { GithubActivityModel } from './models/github-activity.model';
import { GithubModel } from './models/github.model';

@Resolver(() => GithubModel)
export class GithubResolver {
  @Query(() => GithubModel, { name: 'github' })
  async getBaseModel(): Promise<GithubModel> {
    return new GithubModel();
  }

  @ResolveField(() => GithubActivityModel, { name: 'total' })
  async total(): Promise<GithubActivityModel> {
    return new GithubActivityModel('total');
  }

  @ResolveField(() => GithubActivityModel, { name: 'featured' })
  async featured(): Promise<GithubActivityModel> {
    return new GithubActivityModel('featured');
  }

  @ResolveField(() => GithubActivityModel, { name: 'repository' })
  async repository(
    @Args({ name: 'repository', type: () => FeaturedRepositoryEnum }) repository: FeaturedRepositoryEnum
  ): Promise<GithubActivityModel> {
    return new GithubActivityModel(repository);
  }
}
