import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardSkeletonComponent } from './book-card-skeleton.component';

describe('BookCardSkeleton', () => {
  let component: BookCardSkeletonComponent;
  let fixture: ComponentFixture<BookCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
