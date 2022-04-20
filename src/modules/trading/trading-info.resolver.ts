import { Args, Info, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { TradingService } from 'src/common/trading/trading.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { TradingInfoModel } from './models/trading-info.model';

@Resolver(() => TradingInfoModel)
export class TradingInfoResolver {
  constructor(
    private readonly tradingService: TradingService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'price' })
  public async price(
    @Parent() { firstToken, secondToken }: TradingInfoModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.tradingService.resolveTradingQuery(firstToken, secondToken, 'price', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'volume' })
  public async volume(
    @Parent() { firstToken, secondToken }: TradingInfoModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.tradingService.resolveTradingQuery(firstToken, secondToken, 'volume', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'fee' })
  public async fee(
    @Parent() { firstToken, secondToken }: TradingInfoModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.tradingService.resolveTradingQuery(firstToken, secondToken, 'fee', query, aggregates);
  }
}
