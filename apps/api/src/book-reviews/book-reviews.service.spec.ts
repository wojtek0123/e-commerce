import { Test, TestingModule } from '@nestjs/testing';
import { BookReviewsService } from './book-reviews.service';

describe('BookRatingsService', () => {
  let service: BookReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookReviewsService],
    }).compile();

    service = module.get<BookReviewsService>(BookReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
