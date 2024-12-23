export const getSelectedItemsFromQueryParam = (
  queryParamValue: string | null,
) => {
  return queryParamValue?.replaceAll('_', ' ');
};
