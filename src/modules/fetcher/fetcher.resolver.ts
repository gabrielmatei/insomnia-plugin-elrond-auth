import { Resolver, Query, Args } from '@nestjs/graphql';
import { AccountsEntity } from 'src/common/timescale/entities/accounts.entity';
import { FetcherService } from './fetcher.service';
import { HistoricalValue, ScalarValue } from './models/fetcher.model';

@Resolver(() => String)
export class FetcherResolver {
    constructor(
        private readonly fetcherService: FetcherService
    ) { }

    @Query(() => String)
    async hello() {
        return 'hello';
    }

    @Query(() => ScalarValue, { nullable: true })
    async userAdoptionValue(
        @Args('key', { type: () => String }) key: string = 'count'
    ): Promise<ScalarValue | undefined> {
        const lastValue = await this.fetcherService.getLastValue(AccountsEntity, 'accounts', key);
        return ScalarValue.fromValue(lastValue);
    }

    @Query(() => [HistoricalValue])
    async userAdoptionHistorical(): Promise<HistoricalValue[]> {
        return [];
    }
}
