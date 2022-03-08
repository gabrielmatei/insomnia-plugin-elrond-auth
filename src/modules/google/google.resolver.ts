import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GoogleKeywordsEnum } from './models/google-keywords.enum';
import { GoogleModel } from './models/google.model';
import { KeywordModel } from './models/keyword.model';

@Resolver(() => GoogleModel)
export class GoogleResolver {
  @Query(() => GoogleModel, { name: 'google' })
  async getModel(): Promise<GoogleModel> {
    return new GoogleModel();
  }

  @ResolveField(() => KeywordModel, { name: 'total' })
  async getTotal(): Promise<KeywordModel> {
    return new KeywordModel('total');
  }

  @ResolveField(() => KeywordModel, { name: 'keyword' })
  async getKeyword(
    @Args({ name: 'keyword', type: () => GoogleKeywordsEnum }) keyword: GoogleKeywordsEnum
  ): Promise<KeywordModel> {
    return new KeywordModel(keyword);
  }
}
