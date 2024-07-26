import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksActiveFiltersComponent } from './books-active-filter.component';

describe('BooksActiveFilterComponent', () => {
  let component: BooksActiveFiltersComponent;
  let fixture: ComponentFixture<BooksActiveFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksActiveFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksActiveFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
