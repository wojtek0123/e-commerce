import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressInformationComponent } from './address-information.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserAddress } from '@e-commerce/shared/api-models';

describe('BooksGridComponent', () => {
  let component: AddressInformationComponent;
  let fixture: ComponentFixture<AddressInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInformationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('address', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "pointer-events-none" class when clickable is false', () => {
    fixture.componentRef.setInput('clickable', false);

    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    expect(buttonElement.classList.value).toMatch(/pointer-events-none/);
  });

  it('should have NOT "pointer-events-none" class when clickable is true', () => {
    fixture.componentRef.setInput('clickable', true);

    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;

    expect(buttonElement.classList.value).not.toMatch(/pointer-events-none/);
  });

  it('should emit address when click delete button', () => {
    const { fixture, addressInformationEl } = setup();
    const hostComponent = fixture.componentInstance;
    jest.spyOn(hostComponent, 'delete');

    fixture.detectChanges();

    const button = addressInformationEl.query(
      By.css('[data-testId="delete-button"]'),
    );

    button.componentInstance.onClick.emit();
    fixture.detectChanges();

    expect(hostComponent.delete).toHaveBeenCalled();
  });

  it('should emit address when click edit button', () => {
    const { fixture, addressInformationEl } = setup();
    const hostComponent = fixture.componentInstance;
    jest.spyOn(hostComponent, 'edit');

    const button = addressInformationEl.query(
      By.css('[data-testId="edit-button"]'),
    );

    button.componentInstance.onClick.emit();
    fixture.detectChanges();

    expect(hostComponent.edit).toHaveBeenCalled();
  });
});

function setup() {
  @Component({
    imports: [AddressInformationComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<lib-address-information
      [address]="address"
      (onSelect)="select()"
      (onDelete)="delete()"
      (onEdit)="edit()"
    />`,
  })
  class HostTestComponent {
    address = address;
    selectedAddress?: UserAddress;
    deletedAddress?: UserAddress;

    select() {}
    delete() {}
    edit() {}
  }

  let fixture = TestBed.createComponent(HostTestComponent);
  let addressInformationEl = fixture.debugElement.query(
    By.directive(AddressInformationComponent),
  );

  fixture.detectChanges();

  return { fixture, addressInformationEl };
}

const address: UserAddress = {
  id: 'test-id',
  countryId: '1',
  country: {
    id: '12',
    name: 'country',
    code: 'cc',
  },
  phone: '123-123-123',
  postcode: '00-000',
  street: 'test',
  firstName: 'Test',
  lastName: 'User',
  homeNumber: '12a',
  houseNumber: '43',
  city: 'Test city',
};
