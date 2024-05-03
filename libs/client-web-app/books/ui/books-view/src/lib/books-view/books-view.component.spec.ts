import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksViewComponent } from './books-view.component';

describe('BooksViewComponent', () => {
  let component: BooksViewComponent;
  let fixture: ComponentFixture<BooksViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
