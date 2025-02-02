export function parseNumber(
  value: string | undefined,
  fallback: number,
): number {
  const parsedValue = value ? parseInt(value, 10) : NaN;
  return isNaN(parsedValue) ? fallback : parsedValue;
}
