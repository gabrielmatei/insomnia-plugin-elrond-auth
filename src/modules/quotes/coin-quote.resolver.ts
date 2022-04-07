import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { QuotesEntity } from "src/common/timescale/entities/quotes.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
import { QueryInput } from "../models/query.input";
import { CoinQuoteModel } from "./models/coin-quote.model";

@Resolver(() => CoinQuoteModel)
export class CoinQuoteResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'price' })
  public async price(
    @Parent() { series }: CoinQuoteModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'price', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'market_cap' })
  public async market_cap(
    @Parent() { series }: CoinQuoteModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'market_cap', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'volume_24h' })
  public async volume_24h(
    @Parent() { series }: CoinQuoteModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'volume_24h', query, aggregates);
  }
}
