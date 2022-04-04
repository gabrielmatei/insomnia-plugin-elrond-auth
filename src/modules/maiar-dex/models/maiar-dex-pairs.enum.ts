import { registerEnumType } from "@nestjs/graphql";

export enum MaiarDexPairsEnum {
  WEGLDUSDC = 'WEGLDUSDC',
  WEGLDRIDE = 'WEGLDRIDE',
  WEGLDMEX = 'WEGLDMEX',
  AEROWEGLD = 'AEROWEGLD',
  ISETWEGLD = 'ISETWEGLD',
}

registerEnumType(MaiarDexPairsEnum, { name: 'MaiarDexPairs' });
