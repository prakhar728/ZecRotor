export function toYocto(amount: number | string): bigint {
  // convert NEAR decimal string/number to yocto (bigint)
  const [int = "0", frac = ""] = String(amount).split(".");
  const fracPadded = (frac + "0".repeat(24)).slice(0, 24);
  return BigInt(int + fracPadded);
}

export function nsToEpochMinute(ns: string | number): number {
  const sec = Math.floor(Number(ns) / 1e9);
  return Math.floor(sec / 60) * 60; // align to minute
}