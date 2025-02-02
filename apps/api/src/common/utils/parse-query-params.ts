export function parseQueryParams(param?: string): string[] {
  return (
    param
      ?.split(',')
      .filter(Boolean)
      .map((item) => item.trim()) || []
  );
}
