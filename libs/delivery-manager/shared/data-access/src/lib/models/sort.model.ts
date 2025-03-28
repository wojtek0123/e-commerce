export type SortByMode = 'asc' | 'desc';

export type Sort<T> = {
  by: T;
  mode: SortByMode;
};
