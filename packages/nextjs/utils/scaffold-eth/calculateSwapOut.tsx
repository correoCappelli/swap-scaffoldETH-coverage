export function estimateSwapOut(amountIn: number, reserveIn: number, reserveOut: number, decimals = 2): string {
  const precision = 10 ** decimals;
  const amtIn = BigInt(amountIn * precision);
  const resIn = BigInt(reserveIn * precision);
  const resOut = BigInt(reserveOut * precision);

  const numerator = amtIn * resOut;
  const denominator = resIn + amtIn;
  const out = numerator / denominator;

  return (Number(out) / precision).toFixed(decimals);
}
