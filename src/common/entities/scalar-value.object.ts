import { Field, Float, ObjectType } from "@nestjs/graphql";

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
