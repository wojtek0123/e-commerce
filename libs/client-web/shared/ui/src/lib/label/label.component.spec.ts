import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelComponent } from './label.component';

describe('FormRowComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('invalid', false);
    fixture.componentRef.setInput('idFor', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have class "text-red-600" when is invalid true', () => {
    fixture.componentRef.setInput('invalid', true);

    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector(
      'label',
    ) as HTMLLabelElement;

    expect(labelElement.classList.value).toMatch(/text-red-600/);
  });

  it('should label has for equal to idFor input', () => {
    fixture.componentRef.setInput('idFor', 'test-id');

    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector(
      'label',
    ) as HTMLLabelElement;

    expect(labelElement.htmlFor).toBe('test-id');
  });
});
