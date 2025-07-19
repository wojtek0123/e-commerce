import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('DeleteAddressConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isVisible', true);
    fixture.componentRef.setInput('header', 'Confirmation');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dialog be visible', async () => {
    fixture.componentRef.setInput('isVisible', true);

    fixture.detectChanges();

    await fixture.whenStable();

    const divElement = fixture.nativeElement.querySelector('div:first-child');

    expect(divElement).not.toBeNull();
  });

  it('should dialog NOT be visible', async () => {
    fixture.componentRef.setInput('isVisible', false);

    fixture.detectChanges();

    await fixture.whenStable();

    const divElement = fixture.nativeElement.querySelector('div:first-child');

    expect(divElement).toBeNull();
  });

  it('should emit value when confirm', () => {
    const spy = jest.spyOn(component.confirmed, 'emit');

    const button = fixture.debugElement.query(
      By.css('[data-testId="confirm-btn"]'),
    );

    button.triggerEventHandler('onClick', null);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit value when cancel', () => {
    const spy = jest.spyOn(component.canceled, 'emit');

    const button = fixture.debugElement.query(
      By.css('[data-testId="cancel-btn"]'),
    );

    button.triggerEventHandler('onClick', null);

    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
