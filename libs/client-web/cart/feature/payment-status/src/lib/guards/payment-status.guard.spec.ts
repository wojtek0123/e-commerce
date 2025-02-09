import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';
import { OrderDetailsApiService } from '@e-commerce/client-web/shared/data-access/api-services';
import { findIndex, Observable, of, throwError } from 'rxjs';
import { paymentStatusGuard } from './payment-status.guard';
import {
  OrderDetails,
  ShippingMethod,
  UserAddress,
} from '@e-commerce/shared/api-models';
import { PaymentDetails } from '@prisma/client';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';

describe('paymentStatusGuard', () => {
  let orderDetailsApiService: jest.Mocked<OrderDetailsApiService>;
  let router: jest.Mocked<Router>;
  const mockUrlTree = { mock: 'urlTree' };
  const mockHomePath = '/home';

  beforeEach(() => {
    orderDetailsApiService = {
      getUnique: jest.fn(),
    } as unknown as jest.Mocked<OrderDetailsApiService>;

    router = {
      createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: OrderDetailsApiService,
          useValue: orderDetailsApiService,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: APP_ROUTE_PATHS_TOKEN,
          useValue: {
            HOME: () => mockHomePath,
          },
        },
      ],
    });
  });

  it('should redirect to home when no orderDetailsId is provided', () => {
    const segments: UrlSegment[] = [];
    const result = TestBed.runInInjectionContext(() =>
      paymentStatusGuard({} as any, segments),
    );

    expect(router.createUrlTree).toHaveBeenCalledWith([mockHomePath]);
    expect(result).toBe(mockUrlTree);
  });

  it('should allow navigation when order status is NEW', async () => {
    const segments = [new UrlSegment('123', {})];

    orderDetailsApiService.getUnique.mockReturnValue(
      of({
        status: 'NEW',
        id: '123',
        createdAt: '',
        updatedAt: '',
        paymentDetailsId: '',
        total: 300,
        orderAddress: {} as UserAddress,
        orderItems: [],
        shippingMethod: {} as ShippingMethod,
        paymentDetails: {} as PaymentDetails,
      } satisfies OrderDetails),
    );

    let result;

    const guard = TestBed.runInInjectionContext(() => {
      return paymentStatusGuard({} as Route, segments);
    });

    const guardResult = await guard;

    (guardResult as Observable<any>).subscribe((value) => {
      result = value;
    });

    expect(result).toBe(true);
  });

  it('should redirect to home when order status is not NEW', async () => {
    const segments = [new UrlSegment('123', {})];
    orderDetailsApiService.getUnique.mockReturnValue(
      of({
        status: 'COMPLETED',
        id: '123',
        createdAt: '',
        updatedAt: '',
        paymentDetailsId: '',
        total: 300,
        orderAddress: {} as UserAddress,
        orderItems: [],
        shippingMethod: {} as ShippingMethod,
        paymentDetails: {} as PaymentDetails,
      }),
    );
    let result;

    const guard = TestBed.runInInjectionContext(() => {
      return paymentStatusGuard({} as any, segments);
    });

    const guardResult = await guard;

    (guardResult as Observable<any>).subscribe((value) => {
      result = value;
    });

    expect(router.createUrlTree).toHaveBeenCalledWith([mockHomePath]);
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect to home when API call fails', async () => {
    const segments = [new UrlSegment('123', {})];
    orderDetailsApiService.getUnique.mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    let result;

    const guard = TestBed.runInInjectionContext(() => {
      return paymentStatusGuard({} as any, segments);
    });

    const guardResult = await guard;

    (guardResult as Observable<any>).subscribe((value) => {
      result = value;
    });

    expect(router.createUrlTree).toHaveBeenCalledWith([mockHomePath]);
    expect(result).toBe(mockUrlTree);
  });
});
