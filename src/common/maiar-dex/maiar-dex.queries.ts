export function getPairsQuery(offset: number, limit: number): string {
  return `{
    pairs(offset: ${offset}, limit: ${limit}) {
      address
      state
      firstToken {
        identifier
        name
      }
      secondToken {
        identifier
        name
      }
    }
  }`;
}

export function getTotalValueLockedQuery(): string {
  return `{
    totalValueLockedUSD
  }`;
}
