import { sortBy } from 'lodash-es';

export const buildSelectedItemsQueryParam = <T>(
  selectedItems: T[] | undefined,
  key: keyof T,
) => {
  if (!selectedItems || selectedItems.length === 0) return null;

  return sortBy(selectedItems, key)
    .map((item) =>
      typeof item[key] === 'string'
        ? item[key].replaceAll(' ', '_')
        : item[key],
    )
    .join(',');
};
