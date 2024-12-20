import { inject } from '@angular/core';
import { CountryApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { ResponseError } from '@e-commerce/shared/api-models';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Country } from '@prisma/client';
import { debounce, of, pipe, switchMap, timer } from 'rxjs';
import { MessageService } from 'primeng/api';

interface CountryState {
  countries: Country[];
}

const initialCountryState: CountryState = {
  countries: [],
};

export const CountryStore = signalStore(
  { providedIn: 'root' },
  withState(initialCountryState),
  withMethods(
    (
      store,
      messageService = inject(MessageService),
      countryApi = inject(CountryApiService),
    ) => ({
      getCountries$: rxMethod<{ name: string }>(
        pipe(
          debounce(({ name }) => (name.length === 0 ? of({}) : timer(300))),
          switchMap(({ name }) =>
            countryApi.getAll$({ nameLike: name }).pipe(
              tapResponse({
                next: (countries) => {
                  patchState(store, { countries });
                },
                error: (error: ResponseError) => {
                  messageService.add({
                    summary: 'Error',
                    detail:
                      error?.error?.message ||
                      'Error occur while getting countries',
                    severity: 'error',
                  });
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
