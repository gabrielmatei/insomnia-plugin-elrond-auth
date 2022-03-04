import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';

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
