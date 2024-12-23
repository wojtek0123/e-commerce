import { sortBy } from 'lodash-es';

export const buildSelectedItemsQueryParam = <T>(
  selectedItems: T[] | undefined,
  sortByKey?: keyof T,
) => {
  if (!selectedItems || selectedItems.length === 0) return null;

  if (!sortByKey) {
    return [...selectedItems.sort()].join(',');
  }

  return sortBy(selectedItems, sortByKey)
    .map((item) =>
      typeof item[sortByKey] === 'string'
        ? item[sortByKey].replaceAll(' ', '_')
        : item[sortByKey],
    )
    .join(',');
};
