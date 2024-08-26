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
import { MessageService } from 'primeng/api';

@Injectable()
export class OrderProcessEffects {
  private readonly actions$ = inject(Actions);
  private readonly shippingMethodsApi = inject(ShippingMethodApiService);
  private readonly userAddressApi = inject(UserAddressApiService);
  private readonly creditCardApi = inject(CreditCardApiService);
  private readonly countryApi = inject(CountryApiService);
  private readonly messageService = inject(MessageService);

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

  updateUserAddress = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.updateUserAddress),
      switchMap(({ id, data }) =>
        this.userAddressApi.updateUserAddress$(id, data).pipe(
          mapResponse({
            next: (userAddress) => {
              return orderProcessActions.updateUserAddressSucess({
                userAddress,
              });
            },
            error: (error: ResponseError) => {
              this.messageService.add({
                detail: 'Error',
                summary: error.message || 'Error occur while updating address',
                severity: 'danger',
              });
              return orderProcessActions.updateUserAddressFailure({ error });
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

  addCreditCard = createEffect(() =>
    this.actions$.pipe(
      ofType(orderProcessActions.addCreditCard),
      switchMap(({ data }) =>
        this.creditCardApi.create$(data).pipe(
          mapResponse({
            next: (creditCard) => {
              return orderProcessActions.addCreditCardSucess({
                creditCard,
              });
            },
            error: (error: ResponseError) => {
              return orderProcessActions.addCreditCardFailure({ error });
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
