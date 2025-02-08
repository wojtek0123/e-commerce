import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingInputComponent } from './rating-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('RatingInputComponent', () => {
  let component: RatingInputComponent;
  let fixture: ComponentFixture<RatingInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.starsCount()).toBe(5);
    expect(component.readonly()).toBe(false);
    expect(component.invalid()).toBe(false);
    expect(component.rate()).toBe(0);
    expect(component.disabled()).toBe(false);
    expect(component.stars().length).toBe(5);
  });

  it('should set rate when setRate is called', () => {
    const mockEvent = new Event('click');

    component.setRate(mockEvent, 3);

    expect(component.rate()).toBe(3);
  });

  it('should reset rate to 0 when clicking the same rate twice', () => {
    const mockEvent = new Event('click');

    component.setRate(mockEvent, 3);
    component.setRate(mockEvent, 3);

    expect(component.rate()).toBe(0);
  });

  it('should not set rate when disabled', () => {
    const mockEvent = new Event('click');

    component.setDisabledState(true);
    component.setRate(mockEvent, 3);

    expect(component.rate()).toBe(0);
  });

  describe('ControlValueAccessor implementation', () => {
    let formControl: FormControl;

    beforeEach(() => {
      formControl = new FormControl(0);
      formControl.registerOnChange((value: number | null) =>
        component.writeValue(value),
      );
    });

    it('should update rate when writeValue is called', () => {
      component.writeValue(4);

      expect(component.rate()).toBe(4);
    });

    it('should set rate to 0 when writeValue is called with null', () => {
      component.writeValue(3);
      component.writeValue(null);

      expect(formControl.value).toBe(0);
    });

    it('should call onChange when rate changes', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      const mockEvent = new Event('click');
      component.setRate(mockEvent, 4);

      expect(onChangeSpy).toHaveBeenCalledWith(4);
    });

    it('should update disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled()).toBe(true);

      component.setDisabledState(false);
      expect(formControl.disabled).toBe(false);
    });
  });

  describe('Input properties', () => {
    it('should update starsCount', () => {
      fixture.componentRef.setInput('starsCount', 10);

      expect(component.stars().length).toBe(10);
    });

    it('should update readonly state', () => {
      fixture.componentRef.setInput('readonly', true);

      expect(component.readonly()).toBe(true);
    });

    it('should update invalid state', () => {
      fixture.componentRef.setInput('invalid', true);

      expect(component.invalid()).toBe(true);
    });
  });
});
