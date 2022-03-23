import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FeaturedRepositoryEnum } from './models/featured-repository.enum';
import { GithubActivityModel } from './models/github-activity.model';
import { GithubModel } from './models/github.model';

@Resolver(() => GithubModel)
export class GithubResolver {
  @Query(() => GithubModel, { name: 'github' })
  getBaseModel(): GithubModel {
    return new GithubModel();
  }

  @ResolveField(() => GithubActivityModel, { name: 'total' })
  total(): GithubActivityModel {
    return new GithubActivityModel('total');
  }

  @ResolveField(() => GithubActivityModel, { name: 'featured' })
  featured(): GithubActivityModel {
    return new GithubActivityModel('featured');
  }

  @ResolveField(() => GithubActivityModel, { name: 'repository' })
  repository(
    @Args({ name: 'repository', type: () => FeaturedRepositoryEnum }) repository: FeaturedRepositoryEnum
  ): GithubActivityModel {
    return new GithubActivityModel(repository);
  }
}
