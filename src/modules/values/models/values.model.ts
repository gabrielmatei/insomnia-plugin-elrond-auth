import { ObjectType, Field, Float, registerEnumType, InputType, GraphQLISODateTime } from '@nestjs/graphql';

export enum TimeResolutions {
  HOUR = "1 hour",
  DAY = "1 day",
}

registerEnumType(TimeResolutions, { name: 'TimeResolutions' });

@ObjectType()
export class ScalarValue {
  @Field(() => Float, { nullable: true })
  value!: number;

  @Field(() => String, { nullable: true })
  time!: string;

  constructor(init?: Partial<ScalarValue>) {
    Object.assign(this, init);
  }
}

@InputType()
export class HistoricalInput {
  @Field(() => String)
  key!: string;

  @Field(() => GraphQLISODateTime)
  startDate!: Date;

  @Field(() => GraphQLISODateTime)
  endDate!: Date;

  @Field(() => TimeResolutions)
  resolution!: TimeResolutions;
}
