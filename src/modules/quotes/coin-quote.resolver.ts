import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { QuotesEntity } from "src/common/timescale/entities/quotes.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { CoinQuoteModel } from "./models/coin-quote.model";

@Resolver(() => CoinQuoteModel)
export class CoinQuoteResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'price' })
  public async price(
    @Parent() { series }: CoinQuoteModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'price', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'market_cap' })
  public async market_cap(
    @Parent() { series }: CoinQuoteModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'market_cap', query);
  }

  @ResolveField(() => [ScalarValue], { name: 'volume_24h' })
  public async volume_24h(
    @Parent() { series }: CoinQuoteModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(QuotesEntity, series, 'volume_24h', query);
  }
}
