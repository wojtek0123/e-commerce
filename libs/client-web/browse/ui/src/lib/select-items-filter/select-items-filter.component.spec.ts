import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectItemsFilterComponent } from './select-items-filter.component';

describe('SelectItemsFilterComponent', () => {
  let component: SelectItemsFilterComponent;
  let fixture: ComponentFixture<SelectItemsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectItemsFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectItemsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
