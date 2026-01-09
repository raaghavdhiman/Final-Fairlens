const INR_PER_ETH = 290000; // static for now (can be dynamic later)

export function ethToInr(eth: number) {
  return Math.round(eth * INR_PER_ETH);
}
