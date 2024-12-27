import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorAndRetryMessageComponent } from './error-and-retry-message.component';

describe('ErrorAndRetryMessageComponent', () => {
  let component: ErrorAndRetryMessageComponent;
  let fixture: ComponentFixture<ErrorAndRetryMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorAndRetryMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorAndRetryMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
