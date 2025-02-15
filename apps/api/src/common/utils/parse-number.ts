export function parseNumber(value: string | undefined): number {
  const parsedValue = value ? parseInt(value, 10) : NaN;
  return isNaN(parsedValue) ? null : parsedValue;
}
