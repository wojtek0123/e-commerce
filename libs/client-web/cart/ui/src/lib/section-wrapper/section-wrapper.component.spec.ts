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
});
