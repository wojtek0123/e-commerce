import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ShippingStore } from './shipping.store';
import { ShippingMethodApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { delay, of, switchMap, throwError, timer } from 'rxjs';
import { ResponseError, ShippingMethod } from '@e-commerce/shared/api-models';

describe('ShippingStore', () => {
  it('should fetch shippings and update state', fakeAsync(() => {
    const store = setup();

    store.getShippings();

    tick(50);

    expect(store.shippings()).toHaveLength(0);
    expect(store.loading()).toBe(true);
    expect(store.error()).toBeNull();

    tick(100);

    expect(store.shippings()).toBe(shippingMethods);
    expect(store.shippings()).toHaveLength(2);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  }));

  it('should handle error when fetching shippings', fakeAsync(() => {
    const store = setup(true);

    store.getShippings();

    tick(50);

    expect(store.shippings()).toHaveLength(0);
    expect(store.error()).toBeNull();
    expect(store.loading()).toBe(true);

    tick(100);

    expect(store.shippings()).toHaveLength(0);
    expect(store.error()).toEqual(mockError.error.message);
    expect(store.loading()).toBe(false);
  }));

  it('should select a shipping method', () => {
    const store = setup();

    store.selectShipping(shippingMethods[0]);
    expect(store.selectedShipping()).toEqual(shippingMethods[0]);
  });
});

const setup = (shouldReturnError?: boolean) => {
  const shippingMethodApi = {
    getAll$: jest.fn(() =>
      shouldReturnError
        ? timer(100).pipe(switchMap(() => throwError(() => mockError)))
        : of(shippingMethods).pipe(delay(100)),
    ),
  };
  TestBed.configureTestingModule({
    providers: [
      ShippingStore,
      { provide: ShippingMethodApiService, useValue: shippingMethodApi },
    ],
  });

  return TestBed.inject(ShippingStore);
};

const shippingMethods: ShippingMethod[] = [
  {
    id: '1',
    name: 'DHL',
    price: 10,
    deliveryTime: '2d',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'FedEx',
    price: 5,
    deliveryTime: '3d',
    createdAt: '',
    updatedAt: '',
  },
];

const mockError: ResponseError = {
  error: { message: 'Network error', statusCode: 400, error: '' },
};
