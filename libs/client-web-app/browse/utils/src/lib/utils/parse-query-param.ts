import { Observable, OperatorFunction, map } from 'rxjs';
import { Params } from '@angular/router';

export const parseQueryParamToSelectedItems = (
  key: string,
): OperatorFunction<Params, string[]> => {
  return (source: Observable<Params>) =>
    source.pipe(
      map(
        (queryParams) =>
          (queryParams[key] as string | undefined)
            ?.replaceAll('_', ' ')
            .split(',') ?? [],
      ),
    );
};
