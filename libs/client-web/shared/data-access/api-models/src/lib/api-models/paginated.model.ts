export interface Paginated<T> {
  items: T[];
  total: number;
  count: number;
  page: number;
}
