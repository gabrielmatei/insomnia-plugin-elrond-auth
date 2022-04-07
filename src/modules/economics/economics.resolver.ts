import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { EconomicsEntity } from 'src/common/timescale/entities/economics.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { EconomicsModel } from './models/economics.model';

@Resolver(() => EconomicsModel)
export class EconomicsResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @Query(() => EconomicsModel, { name: 'economics' })
  getBaseModel(): EconomicsModel {
    return new EconomicsModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'total_supply' })
  public async getTotalSupply(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(EconomicsEntity, 'economics', 'total_supply', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'circulating_supply' })
  public async getCirculatingSupply(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(EconomicsEntity, 'economics', 'circulating_supply', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'floating_supply' })
  public async getFloatingSupply(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(EconomicsEntity, 'economics', 'floating_supply', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'staked' })
  public async getStaked(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(EconomicsEntity, 'economics', 'staked', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'left_per_user' })
  public async getLeftPerUser(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(EconomicsEntity, 'economics', 'left_per_user', query, aggregates);
  }
}
