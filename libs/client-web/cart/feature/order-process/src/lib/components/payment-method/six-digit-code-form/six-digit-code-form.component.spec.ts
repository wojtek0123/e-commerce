import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SixDigitCodeFormComponent } from './six-digit-code-form.component';

describe('SixDigitCodeFormComponent', () => {
  let component: SixDigitCodeFormComponent;
  let fixture: ComponentFixture<SixDigitCodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SixDigitCodeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SixDigitCodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
