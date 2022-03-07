import { Field, GraphQLISODateTime, InputType } from "@nestjs/graphql";
import { TimeResolutions } from "./time-resolutions.enum";

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
