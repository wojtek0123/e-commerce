import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterAccordionTabComponent } from './filter-accordion.component';

describe('FilterAccordionComponent', () => {
  let component: FilterAccordionTabComponent<string>;
  let fixture: ComponentFixture<FilterAccordionTabComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterAccordionTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterAccordionTabComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
