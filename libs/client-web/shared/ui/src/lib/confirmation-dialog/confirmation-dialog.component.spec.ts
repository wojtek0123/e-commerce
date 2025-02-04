import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteAddressConfirmationDialogComponent } from './delete-confirmation-dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DeleteAddressConfirmationDialogComponent', () => {
  let component: DeleteAddressConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteAddressConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAddressConfirmationDialogComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAddressConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isVisible', false);
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

  // it('should emit value when confirm', () => {
  //   const { fixture, debugEl } = setup();
  //   const hostComponent = fixture.componentInstance;
  //   jest.spyOn(hostComponent, 'delete');
  //
  //   const button = debugEl.query(By.css('[data-testId="confirm-button"]'));
  //
  //   button.componentInstance.onClick.emit();
  //
  //   fixture.detectChanges();
  //
  //   expect(hostComponent.delete).toHaveBeenCalled();
  // });
});

function setup() {
  @Component({
    imports: [DeleteAddressConfirmationDialogComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <lib-delete-address-confirmation-dialog
        [isVisible]="isVisible()"
        (onDelete)="delete()"
        (onHide)="hide()"
      />
    `,
  })
  class HostComponent {
    isVisible = signal(false);

    hide() {}

    delete() {}
  }

  const fixture = TestBed.createComponent(HostComponent);
  const debugEl = fixture.debugElement.query(
    By.directive(DeleteAddressConfirmationDialogComponent),
  );

  fixture.detectChanges();

  return { fixture, debugEl };
}
