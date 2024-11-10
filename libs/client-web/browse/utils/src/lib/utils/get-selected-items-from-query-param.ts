export const getSelectedItemsFromQueryParam = (
  queryParamValue: string | undefined,
) => {
  return queryParamValue?.replaceAll('_', ' ');
};
