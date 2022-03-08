import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ScalarValue } from 'src/common/entities/scalar-value.object';
import { AccountsHistoricalEntity } from 'src/common/timescale/entities/accounts-historical.entity';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { ThresholdCountModel } from './models/threshold-count.model';

@Resolver(() => ThresholdCountModel)
export class ThresholdCountResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_0' })
  public async count_gt_0(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_0', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_0_1' })
  public async count_gt_0_1(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_0_1', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_1' })
  public async count_gt_1(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_1', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_10' })
  public async count_gt_10(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_10', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_100' })
  public async count_gt_100(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_100', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_1000' })
  public async count_gt_1000(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_1000', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_gt_10000' })
  public async count_gt_10000(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_10000', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'count_24h' })
  public async count_24h(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_24h', query);
  }
}
