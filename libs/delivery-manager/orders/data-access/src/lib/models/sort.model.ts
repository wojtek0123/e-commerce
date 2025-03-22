export type SortBy = 'createdAt' | 'status';

export type SortByMode = 'asc' | 'desc';

export type Sort = {
  by: SortBy;
  mode: SortByMode;
};
