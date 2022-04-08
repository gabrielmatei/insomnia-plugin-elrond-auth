import { Args, Info, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { AccountsHistoricalEntity } from 'src/common/timescale/entities/accounts-historical.entity';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { ThresholdCountModel } from './models/threshold-count.model';

@Resolver(() => ThresholdCountModel)
export class ThresholdCountResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_0' })
  public async count_gt_0(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_0', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_0_1' })
  public async count_gt_0_1(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_0_1', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_1' })
  public async count_gt_1(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_1', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_10' })
  public async count_gt_10(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_10', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_100' })
  public async count_gt_100(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_100', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_1000' })
  public async count_gt_1000(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_1000', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_gt_10000' })
  public async count_gt_10000(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_gt_10000', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'count_24h' })
  public async count_24h(
    @Parent() { series, entity }: ThresholdCountModel<AccountsEntity | AccountsHistoricalEntity>,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(entity, series, 'count_24h', query, aggregates);
  }
}
