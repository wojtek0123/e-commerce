import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryAddressComponent } from './delivery-address.component';

describe('DeliveryAddressComponent', () => {
  let component: DeliveryAddressComponent;
  let fixture: ComponentFixture<DeliveryAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryAddressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
