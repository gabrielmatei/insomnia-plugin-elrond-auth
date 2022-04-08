import { Resolver, ResolveField, Parent, Args, Info } from "@nestjs/graphql";
import { AggregateValue } from "src/common/entities/aggregate-value.object";
import { MaiarDexEntity } from "src/common/timescale/entities/maiar-dex.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { ParseFilterEnumArrayPipe } from "src/utils/pipes/parse.filter.enum.array.pipe";
import { ParseQueryFieldsPipe } from "src/utils/pipes/parse.query.fields.pipe";
import { AggregateEnum } from "../models/aggregate.enum";
import { QueryInput } from "../models/query.input";
import { MaiarDexPoolModel } from "./models/maiar-dex-pool.model";

@Resolver(() => MaiarDexPoolModel)
export class MaiarDexPoolResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [AggregateValue], { name: 'volume' })
  public async volume(
    @Parent() { series }: MaiarDexPoolModel,
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, series, 'volume', query, aggregates);
  }
}
