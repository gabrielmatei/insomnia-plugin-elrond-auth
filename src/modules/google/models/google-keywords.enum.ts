import { registerEnumType } from "@nestjs/graphql";

export enum GoogleKeywordsEnum {
  ELROND = 'elrond',
  EGLD = 'egld',
  EGOLD = 'egold',
}

registerEnumType(GoogleKeywordsEnum, { name: 'GoogleKeywords' });
