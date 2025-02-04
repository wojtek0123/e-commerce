import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionWrapperComponent } from './section-wrapper.component';

describe('SectionWrapperComponent', () => {
  let component: SectionWrapperComponent;
  let fixture: ComponentFixture<SectionWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionWrapperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('header', '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display header', () => {
    fixture.componentRef.setInput('header', 'BookStash');
    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('h3');

    expect(headerElement.textContent).toMatch(/BookStash/g);
  });
});
