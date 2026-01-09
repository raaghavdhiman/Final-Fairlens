// Static ETH → INR rate (temporary, safe for MVP)
const ETH_TO_INR = 290000;

export function ethToInr(eth: number): number {
  return eth * ETH_TO_INR;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
