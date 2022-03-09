import { registerEnumType } from "@nestjs/graphql";

export enum FeaturedRepositoryEnum {
  WASM_VM = "wasm-vm",
  ELROND_GO = "elrond-go",
  ELROND_PROXY_GO = "elrond-proxy-go",
  ELROND_SDK = "elrond-sdk",
}

registerEnumType(FeaturedRepositoryEnum, { name: 'FeaturedRepository' });
