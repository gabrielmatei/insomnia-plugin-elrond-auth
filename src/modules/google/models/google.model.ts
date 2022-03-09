import { Field, ObjectType } from "@nestjs/graphql";
import { KeywordModel } from "./keyword.model";

@ObjectType()
export class GoogleModel {
  @Field(() => KeywordModel, {
    name: 'total',
    nullable: true,
  })
  total?: KeywordModel;

  @Field(() => KeywordModel, {
    name: 'keyword',
    nullable: true,
  })
  keyword?: KeywordModel;
}
