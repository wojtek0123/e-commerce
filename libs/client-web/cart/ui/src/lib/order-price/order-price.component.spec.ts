import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPriceComponent } from './order-price.component';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('CartItemComponent', () => {
  let component: OrderPriceComponent;
  let fixture: ComponentFixture<OrderPriceComponent>;

  const mockRoutePaths = {
    books: {
      detail: () => '/books/detail',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPriceComponent],
      providers: [
        { provide: APP_ROUTE_PATHS_TOKEN, useValue: mockRoutePaths },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: '',
        },
        {
          provide: APP_ROUTE_PATHS_TOKEN,
          useValue: { BOOK: (id: string) => '/books' + id },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPriceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cartTotal', 0);
    fixture.componentRef.setInput('shippingPrice', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total price', () => {
    fixture.componentRef.setInput('cartTotal', 100);
    fixture.componentRef.setInput('shippingPrice', 10);
    fixture.detectChanges();

    expect(component.total()).toBe(110);
  });
});
