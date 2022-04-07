import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { Pair } from 'src/common/maiar-dex/entities/pair';
import { MaiarDexService } from 'src/common/maiar-dex/maiar-dex.service';
import { MaiarDexEntity } from 'src/common/timescale/entities/maiar-dex.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { QueryInput } from '../models/query.input';
import { MaiarDexPairsEnum } from './models/maiar-dex-pairs.enum';
import { MaiarDexPoolModel } from './models/maiar-dex-pool.model';
import { MaiarDexModel } from './models/maiar-dex.model';

@Resolver(() => MaiarDexModel)
export class MaiarDexResolver {
  constructor(
    private readonly timescaleService: TimescaleService,
    private readonly maiarDexService: MaiarDexService
  ) { }

  @Query(() => MaiarDexModel, { name: 'maiar_dex' })
  getBaseModel(): MaiarDexModel {
    return new MaiarDexModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'total_value_locked' })
  public async total_value_locked(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'total_value_locked', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'volume' })
  public async volume(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'volume', query);
  }

  @ResolveField(() => [AggregateValue], { name: 'mex_burnt' })
  public async mex_burnt(
    @Args('input') query: QueryInput
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'mex_burnt', query);
  }

  @ResolveField(() => MaiarDexPoolModel, { name: 'pool' })
  getPool(
    @Args({ name: 'pair', type: () => MaiarDexPairsEnum }) pair: MaiarDexPairsEnum
  ): MaiarDexPoolModel {
    return new MaiarDexPoolModel(pair);
  }

  @ResolveField(() => [MaiarDexPoolModel], { name: 'pools' })
  async getAllPools(
  ): Promise<MaiarDexPoolModel[]> {
    const pairs = await this.maiarDexService.getPairs();
    const pairSymbols = pairs.map(pair => Pair.getSymbol(pair));

    const pools = pairSymbols.map(pair => new MaiarDexPoolModel(pair));
    return pools;
  }
}
