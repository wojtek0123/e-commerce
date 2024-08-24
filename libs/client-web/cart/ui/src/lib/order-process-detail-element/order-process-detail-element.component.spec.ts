import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderProcessDetailElementComponent } from './order-process-detail-element.component';

describe('OrderProcessDetailElementComponent', () => {
  let component: OrderProcessDetailElementComponent;
  let fixture: ComponentFixture<OrderProcessDetailElementComponent>;

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
