import { Args, Info, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AggregateValue } from 'src/common/entities/aggregate-value.object';
import { MaiarDexEntity } from 'src/common/timescale/entities/maiar-dex.entity';
import { TimescaleService } from 'src/common/timescale/timescale.service';
import { ParseFilterEnumArrayPipe } from 'src/utils/pipes/parse.filter.enum.array.pipe';
import { ParseQueryFieldsPipe } from 'src/utils/pipes/parse.query.fields.pipe';
import { AggregateEnum } from '../models/aggregate.enum';
import { QueryInput } from '../models/query.input';
import { MaiarDexResolverService } from './maiar-dex.resolver.service';
import { MaiarDexPoolModel } from './models/maiar-dex-pool.model';
import { MaiarDexWeeklyReportModel } from './models/maiar-dex-weekly-report.model';
import { MaiarDexModel } from './models/maiar-dex.model';

@Resolver(() => MaiarDexModel)
export class MaiarDexResolver {
  constructor(
    private readonly timescaleService: TimescaleService,
    private readonly maiarDexResolverService: MaiarDexResolverService
  ) { }

  @Query(() => MaiarDexModel, { name: 'maiar_dex' })
  getBaseModel(): MaiarDexModel {
    return new MaiarDexModel();
  }

  @ResolveField(() => [AggregateValue], { name: 'total_value_locked' })
  public async total_value_locked(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'total_value_locked', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'total_volume' })
  public async total_volume(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'volume', query, aggregates);
  }

  @ResolveField(() => [AggregateValue], { name: 'mex_burnt' })
  public async mex_burnt(
    @Args('query', { nullable: true }) query: QueryInput,
    @Info(ParseQueryFieldsPipe, new ParseFilterEnumArrayPipe(AggregateEnum)) aggregates: AggregateEnum[],
  ): Promise<AggregateValue[]> {
    return await this.timescaleService.resolveQuery(MaiarDexEntity, 'dashboard', 'mex_burnt', query, aggregates);
  }

  @ResolveField(() => MaiarDexPoolModel, { name: 'pool' })
  getPool(
    @Args({ name: 'pair', type: () => String }) pair: string
  ): MaiarDexPoolModel {
    return new MaiarDexPoolModel(pair);
  }

  @ResolveField(() => [MaiarDexPoolModel], { name: 'pools' })
  async getAllPools(): Promise<MaiarDexPoolModel[]> {
    return await this.maiarDexResolverService.getAllPools();
  }

  @ResolveField(() => MaiarDexWeeklyReportModel, { name: 'weekly_report' })
  async getWeeklyReport(): Promise<MaiarDexWeeklyReportModel> {
    return await this.maiarDexResolverService.getWeeklyReport();
  }
}
