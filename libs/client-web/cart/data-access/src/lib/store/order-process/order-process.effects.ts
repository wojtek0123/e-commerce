import { inject, Injectable } from '@angular/core';
import {
  CountryApiService,
  CreditCardApiService,
  ResponseError,
  ShippingMethodApiService,
  UserAddressApiService,
} from '@e-commerce/client-web/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { orderProcessActions } from './order-process.actions';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';

@Injectable()
export class OrderProcessEffects {
  private readonly actions$ = inject(Actions);
  private readonly shippingMethodsApi = inject(ShippingMethodApiService);
  private readonly userAddressApi = inject(UserAddressApiService);
  private readonly creditCardApi = inject(CreditCardApiService);
  private readonly countryApi = inject(CountryApiService);

  getUserAddress = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.getUserAddress),
      switchMap(() =>
        this.userAddressApi.getUserAddress$().pipe(
          mapResponse({
            next: (userAddress) => {
              return orderProcessActions.getUserAddressSuccess({ userAddress });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.getUserAddressFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  addUserAddress = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.addUserAddress),
      switchMap(({ data }) =>
        this.userAddressApi.createUserAddress$(data).pipe(
          mapResponse({
            next: (userAddress) => {
              return orderProcessActions.addUserAddressSucess({ userAddress });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.addUserAddressFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  getShippingMethods = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.getShippingMethods),
      switchMap(() =>
        this.shippingMethodsApi.getShippingMethods$().pipe(
          mapResponse({
            next: (shippingMethods) => {
              return orderProcessActions.getShippingMethodsSuccess({
                shippingMethods,
              });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.getShippingMethodsFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  getCreditCard = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.getCreditCard),
      switchMap(() =>
        this.creditCardApi.get$().pipe(
          mapResponse({
            next: (creditCard) => {
              return orderProcessActions.getCreditCardSuccess({
                creditCard,
              });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.getCreditCardFailure({ error });
            },
          }),
        ),
      ),
    ),
  );

  getCountries = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.getCountries),
      switchMap(() =>
        this.countryApi.getCountries().pipe(
          mapResponse({
            next: (countries) => {
              return orderProcessActions.getCountriesSuccess({
                countries,
              });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.getCountriesFailure({ error });
            },
          }),
        ),
      ),
    ),
  );
}
