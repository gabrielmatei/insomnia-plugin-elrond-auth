import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class TradeModel {
  @Field(() => Number, { nullable: true })
  timestamp: number = 0;

  @Field(() => String, { nullable: true })
  firstToken: string = '';

  @Field(() => String, { nullable: true })
  secondToken: string = '';

  @Field(() => Number, { nullable: true })
  price: number = 0;

  @Field(() => Number, { nullable: true })
  volume: number = 0;
}
