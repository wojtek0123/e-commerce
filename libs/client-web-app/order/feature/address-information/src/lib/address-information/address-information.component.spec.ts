import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressInformationComponent } from './address-information.component';

describe('AddressInformationComponent', () => {
  let component: AddressInformationComponent;
  let fixture: ComponentFixture<AddressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
