import { Field, ObjectType } from "@nestjs/graphql";
import { GithubActivityModel } from "./github-activity.model";

@ObjectType()
export class GithubModel {
  @Field(() => GithubActivityModel, { name: 'total', nullable: true })
  total?: GithubActivityModel;

  @Field(() => GithubActivityModel, { name: 'featured', nullable: true })
  featured?: GithubActivityModel;

  @Field(() => GithubActivityModel, { name: 'repository', nullable: true })
  repository?: GithubActivityModel;
}
