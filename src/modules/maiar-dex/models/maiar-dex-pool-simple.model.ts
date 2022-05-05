import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MaiarDexPoolSimpleModel {
  @Field(() => String, { name: 'name', nullable: true })
  name?: string;

  @Field(() => Number, { name: 'volume', nullable: true })
  volume?: number;

  constructor(init?: Partial<MaiarDexPoolSimpleModel>) {
    Object.assign(this, init);
  }
}
