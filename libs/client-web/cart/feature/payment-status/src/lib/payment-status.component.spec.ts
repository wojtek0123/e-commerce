import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentStatusComponent } from './payment-status.component';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PaymentStatusComponent', () => {
  let component: PaymentStatusComponent;
  let fixture: ComponentFixture<PaymentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStatusComponent],
      providers: [
        {
          provide: APP_ROUTE_PATHS_TOKEN,
          useValue: { ORDERS: () => '/orders' },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('orderDetailsId', 'order-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loading lasts for 3s', async () => {
    await fixture.whenStable();

    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(component.loading()).toBe(false);
  });

  it('should redirect to order details after clicking a link', async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const href = fixture.debugElement
      .query(By.css('a'))
      .nativeElement.getAttribute('href');

    expect(href).toEqual('/orders?orderDetailsId=order-id');
  });
});
