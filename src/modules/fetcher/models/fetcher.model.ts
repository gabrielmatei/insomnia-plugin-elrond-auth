import { ObjectType, Field, Float } from '@nestjs/graphql';
import moment from 'moment';

@ObjectType()
export class ScalarValue {
  @Field(() => Float)
  value!: number;

  constructor(init?: Partial<ScalarValue>) {
    Object.assign(this, init);
  }

  static fromValue(value: number | undefined): ScalarValue | undefined {
    if (value === undefined) {
      return undefined;
    }
    return new ScalarValue({ value });
  }
}

@ObjectType()
export class HistoricalValue {
  @Field(() => Float, { nullable: true })
  value!: number;

  @Field(() => String, { nullable: true })
  time!: string;

  constructor(init?: Partial<HistoricalValue>) {
    Object.assign(this, init);
  }

  static fromValues(values: { time: string, value: number }[]): HistoricalValue[] {
    return values
      .map(value => new HistoricalValue({
        value: value.value,
        time: moment.utc(value.time).toISOString(),
      }));
  }
}
