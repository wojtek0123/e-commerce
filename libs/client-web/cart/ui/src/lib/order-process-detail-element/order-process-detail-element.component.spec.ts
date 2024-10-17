import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderProcessDetailElementComponent } from './order-process-detail-element.component';

describe('OrderProcessDetailElementComponent', () => {
  let component: OrderProcessDetailElementComponent<unknown>;
  let fixture: ComponentFixture<OrderProcessDetailElementComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProcessDetailElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProcessDetailElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
