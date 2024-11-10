import { sortBy } from 'lodash-es';

export const buildSelectedItemsQueryParam = <T>(
  selectedItems: T[],
  key: keyof T,
) => {
  if (selectedItems.length === 0) return null;

  return sortBy(selectedItems, key)
    .map((item) =>
      typeof item[key] === 'string'
        ? item[key].replaceAll(' ', '_')
        : item[key],
    )
    .join(',');
};
