import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditCardFormComponent } from './credit-card-form.component';

describe('CreditCardFormComponent', () => {
  let component: CreditCardFormComponent;
  let fixture: ComponentFixture<CreditCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
