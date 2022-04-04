import { Resolver, ResolveField, Parent, Args } from "@nestjs/graphql";
import { ScalarValue } from "src/common/entities/scalar-value.object";
import { MaiarDexEntity } from "src/common/timescale/entities/maiar-dex.entity";
import { TimescaleService } from "src/common/timescale/timescale.service";
import { QueryInput } from "../models/query.input";
import { MaiarDexPoolModel } from "./models/maiar-dex-pool.model";

@Resolver(() => MaiarDexPoolModel)
export class MaiarDexPoolResolver {
  constructor(
    private readonly timescaleService: TimescaleService
  ) { }

  @ResolveField(() => [ScalarValue], { name: 'volume' })
  public async volume(
    @Parent() { series }: MaiarDexPoolModel,
    @Args('input') query: QueryInput
  ): Promise<ScalarValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, series, 'volume', query);
  }
}
