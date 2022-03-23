import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { MaiarModel } from './models/maiar.model';

@Resolver(() => MaiarModel)
export class MaiarResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => MaiarModel, { name: 'maiar' })
  getBaseModel(): MaiarModel {
    return new MaiarModel();
  }

  @ResolveField(() => [ScalarValue], { name: 'count' })
  public async count(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'maiar', 'count', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(AccountsEntity, 'maiar', 'count_24h', query);
  }
}
