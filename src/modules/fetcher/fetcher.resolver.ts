import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => String)
export class FetcherResolver {
    @Query(() => String)
    async hello() {
        return 'hello';
    }
}
