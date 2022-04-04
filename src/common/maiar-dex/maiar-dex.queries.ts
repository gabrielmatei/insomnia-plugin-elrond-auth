export function getPairsQuery(): string {
  return `{
    pairs {
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
