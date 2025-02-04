import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { APP_ROUTE_PATHS_TOKEN } from '@e-commerce/client-web/shared/app-config';
import { Book } from '@e-commerce/shared/api-models';
import { ActivatedRoute } from '@angular/router';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
      providers: [
        {
          provide: APP_ROUTE_PATHS_TOKEN,
          useValue: { BOOK: (id: string) => `/${id}` },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('book', book);
    fixture.componentRef.setInput('favouriteBooks', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

const book: Book = {
  id: 'test-book',
  title: 'Test title',
  authors: [
    {
      id: 'test-author-1',
      name: 'test-author-1',
    },
    {
      id: 'test-author-2',
      name: 'test-author-2',
    },
  ],
  category: {
    id: 'test-category',
    name: 'test-category',
  },
  categoryId: 'test-category',
  createdAt: '',
  updatedAt: '',
  coverImage: '',
  price: 10.89,
  pages: 256,
  publishedDate: '',
  description: 'Test description',
  language: 'english',
};
