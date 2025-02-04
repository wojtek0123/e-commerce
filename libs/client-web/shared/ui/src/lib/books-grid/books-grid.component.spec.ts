import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksGridComponent } from './books-grid.component';

describe('BooksGridComponent', () => {
  let component: BooksGridComponent;
  let fixture: ComponentFixture<BooksGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('books', []);
    fixture.componentRef.setInput('favouriteBooks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "No books were found!" when books is empty array', () => {
    fixture.componentRef.setInput('books', []);
    fixture.detectChanges();

    const divElement = fixture.nativeElement.querySelector(
      '[data-testId="no-books"]',
    );

    expect(divElement.textContent).toMatch(/No books were found!/);
  });
});
