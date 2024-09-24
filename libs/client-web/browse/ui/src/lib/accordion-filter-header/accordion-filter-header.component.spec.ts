import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionFilterHeaderComponent } from './accordion-filter-header.component';

describe('AccordionFilterHeaderComponent', () => {
  let component: AccordionFilterHeaderComponent;
  let fixture: ComponentFixture<AccordionFilterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionFilterHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionFilterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
