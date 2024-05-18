import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksSearchComponent as BooksSearchComponent } from './books-search.component';

describe('SearchComponent', () => {
  let component: BooksSearchComponent;
  let fixture: ComponentFixture<BooksSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
