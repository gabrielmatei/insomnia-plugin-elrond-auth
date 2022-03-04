import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class FetcherModel {
    @Field(() => Int)
    id: number = 0;

    constructor(init?: Partial<FetcherModel>) {
        Object.assign(this, init);
    }
}
