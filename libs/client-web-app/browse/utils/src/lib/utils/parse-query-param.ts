import { Observable, OperatorFunction, map } from 'rxjs';
import { Params } from '@angular/router';

export const parseQueryParamToSelectedItemsOperator = (
  key: string,
): OperatorFunction<Params, string[]> => {
  return (source: Observable<Params>) =>
    source.pipe(
      map((queryParams) => parseQueryParamToSelectedItems(queryParams, key)),
    );
};

export const parseQueryParamToSelectedItems = (
  queryParams: Params,
  key: string,
) => {
  return (
    (queryParams[key] as string | undefined)?.replaceAll('_', ' ').split(',') ??
    []
  );
};

export const parseQueryParamToNumber = (
  queryParams: Params,
  key: string,
): number | undefined => {
  const param = queryParams[key] as string | undefined;
  return param ? +param : undefined;
};
