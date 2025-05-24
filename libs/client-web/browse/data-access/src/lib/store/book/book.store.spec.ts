import { TestBed } from '@angular/core/testing';
import { BookStore } from './book.store';
import {
  BookReviewApiService,
  BooksApiService,
  OrderDetailsApiService,
} from '@e-commerce/client-web/shared/data-access/api-services';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import {
  BookDetails,
  BookReview,
  ResponseError,
} from '@e-commerce/shared/api-models';

describe('BookStore', () => {
  const mockBook: BookDetails = {
    id: '1',
    title: 'Test Book',
    inventory: {
      id: '',
      updatedAt: '',
      createdAt: '',
      quantity: 5,
      book: {
        id: '1',
        title: 'Test Book',
        reviews: [
          {
            createdAt: '',
            updatedAt: '',
            userId: '1',
            message: 'test',
            id: 'test-review-1',
            name: 'test',
            rating: 5,
          },
        ],
        authors: [
          {
            id: 'author-1',
            name: 'test author',
          },
        ],
        createdAt: '2024-01-23',
        updatedAt: '2024-01-23',
        categoryId: '1',
        category: {
          id: '12',
          name: 'action',
        },
        description: '',
        price: 23.99,
        pages: 300,
        publishedDate: '2024-01-23',
        coverImage: '',
        language: 'polish',
      },
    },
    reviews: [
      {
        createdAt: '',
        updatedAt: '',
        userId: '1',
        message: 'test',
        id: 'test-review-1',
        name: 'test',
        rating: 5,
      },
    ],
    authors: [
      {
        id: 'author-1',
        name: 'test author',
      },
    ],
    createdAt: '2024-01-23',
    updatedAt: '2024-01-23',
    categoryId: '1',
    category: {
      id: '12',
      name: 'action',
    },
    description: '',
    price: 23.99,
    pages: 300,
    publishedDate: '2024-01-23',
    coverImage: '',
    language: 'polish',
  };

  const mockError: ResponseError = {
    error: { message: 'Test error', error: 'Test error', statusCode: 404 },
  };

  describe('getBook', () => {
    it('should fetch book successfully', () => {
      const { store, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      expect(store.book()).toEqual(mockBook);
      expect(store.loading()).toBeFalsy();
      expect(store.error()).toBeNull();
    });

    it('should handle error when fetching book fails', () => {
      const { store, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(throwError(() => mockError));

      store.getBook({ bookId: '1' });

      expect(store.book()).toBeNull();
      expect(store.loading()).toBeFalsy();
      expect(store.error()).toBe('Test error');
    });
  });

  describe('addReview', () => {
    const mockReview = {
      name: 'John',
      rating: 5,
      message: 'Great book',
    };

    it('should add review successfully', () => {
      const { store, bookReviewApiService, booksApiService, messageService } =
        setup();

      const newReview: BookReview = {
        id: '1',
        userId: '2',
        createdAt: '',
        updatedAt: '',
        name: 'test',
        message: 'test',
        rating: 4,
      };

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      bookReviewApiService.create.mockReturnValue(of(newReview));

      store.addReview(mockReview);

      expect(store.reviews()).toContainEqual(newReview);
      expect(store.reviewDialog().loading).toBeFalsy();
      expect(store.reviewDialog().visible).toBeFalsy();
      expect(messageService.add).toHaveBeenCalledWith({
        summary: 'Success',
        detail: 'Review has been added',
        severity: 'success',
      });
    });

    it('should handle error when adding review fails', () => {
      const { store, booksApiService, bookReviewApiService, messageService } =
        setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      bookReviewApiService.create.mockReturnValue(throwError(() => mockError));

      store.addReview(mockReview);

      expect(store.reviewDialog().loading).toBeFalsy();
      expect(messageService.add).toHaveBeenCalledWith({
        summary: 'Error',
        detail: 'Test error',
        severity: 'error',
      });
    });
  });

  describe('getOrderByBook', () => {
    it('should set purchased to true when order exists', () => {
      const { store, orderDetailsApiService, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      orderDetailsApiService.getOrderByBook.mockReturnValue(of({}));

      store.getOrderByBook();

      expect(store.purchased()).toBeTruthy();
    });

    it('should set purchased to false when order does not exist', () => {
      const { store, orderDetailsApiService, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      orderDetailsApiService.getOrderByBook.mockReturnValue(
        throwError(() => new Error()),
      );

      store.getOrderByBook();

      expect(store.purchased()).toBeFalsy();
    });
  });

  describe('isUserAddedReview', () => {
    it('should return true when user has added a review', () => {
      const { store, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      const result = store.isUserAddedReview('1');

      expect(result).toBeTruthy();
    });

    it('should return false when user has not added a review', () => {
      const { store, booksApiService } = setup();

      booksApiService.getBook$.mockReturnValue(of(mockBook));

      store.getBook({ bookId: '1' });

      const result = store.isUserAddedReview('user-id-without-review');

      expect(result).toBeFalsy();
    });
  });

  describe('toggleReviewDialog', () => {
    it('should toggle review dialog visibility', () => {
      const { store } = setup();
      expect(store.reviewDialog().visible).toBeFalsy();

      store.toggleReviewDialog();
      expect(store.reviewDialog().visible).toBeTruthy();

      store.toggleReviewDialog();
      expect(store.reviewDialog().visible).toBeFalsy();
    });
  });
});

function setup() {
  const booksApiService = {
    getBook$: jest.fn(),
  };

  const bookReviewApiService = {
    create: jest.fn(),
  };

  const orderDetailsApiService = {
    getOrderByBook: jest.fn(),
  };

  const messageService = {
    add: jest.fn(),
  };

  TestBed.configureTestingModule({
    providers: [
      {
        provide: BooksApiService,
        useValue: booksApiService,
      },
      {
        provide: BookReviewApiService,
        useValue: bookReviewApiService,
      },
      {
        provide: OrderDetailsApiService,
        useValue: orderDetailsApiService,
      },
      {
        provide: MessageService,
        useValue: messageService,
      },
      BookStore,
    ],
  });

  const store = TestBed.inject(BookStore);

  return {
    booksApiService,
    bookReviewApiService,
    orderDetailsApiService,
    messageService,
    store,
  };
}
