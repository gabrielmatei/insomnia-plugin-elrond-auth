import { ObjectType } from "@nestjs/graphql";
import { CountModel } from "src/modules/models/count.model";

@ObjectType()
export class MaiarModel extends CountModel { }
