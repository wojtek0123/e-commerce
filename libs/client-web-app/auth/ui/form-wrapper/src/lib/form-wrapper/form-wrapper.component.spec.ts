import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormWrapperComponent } from './form-wrapper.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

describe('FormWrapperComponent', () => {
  let component: FormWrapperComponent;
  let fixture: ComponentFixture<FormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormWrapperComponent,
        ButtonModule,
        NgIf,
        RouterLink,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: '',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should have the correct inputs', () => {
    component.title = 'Test Title';
    component.text = 'Test Text';
    component.link = { url: 'test-url', name: 'Test Link' };
    component.submitButtonLabel = 'Submit Label';
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h2');
    const textElement = fixture.nativeElement.querySelector('span:first-child');
    const linkElement = fixture.nativeElement.querySelector('a');
    const submitButton = fixture.nativeElement.querySelector('button');
    expect(titleElement.textContent).toContain('Test Title');
    expect(textElement.textContent).toContain('Test Text');
    expect(linkElement.textContent).toContain('Test Link');
    expect(submitButton.textContent).toContain('Submit Label');
  });

  it('should emit submitEvent when onSubmit is called', () => {
    jest.spyOn(component.submitEvent, 'emit');
    const event = new MouseEvent('click');
    jest.spyOn(event, 'preventDefault');
    component.onSubmit(event);
    expect(component.submitEvent.emit).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
