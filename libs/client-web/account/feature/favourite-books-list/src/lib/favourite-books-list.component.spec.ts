import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouriteBooksListComponent } from './favourite-books-list.component';

describe('FavouriteBooksListComponent', () => {
  let component: FavouriteBooksListComponent;
  let fixture: ComponentFixture<FavouriteBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteBooksListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouriteBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
