import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksActiveFilterComponent } from './books-active-filter.component';

describe('BooksActiveFilterComponent', () => {
  let component: BooksActiveFilterComponent;
  let fixture: ComponentFixture<BooksActiveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksActiveFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksActiveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
