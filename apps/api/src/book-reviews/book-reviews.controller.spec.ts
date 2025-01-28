import { Test, TestingModule } from '@nestjs/testing';
import { BookRatingsController } from './book-ratings.controller';
import { BookRatingsService } from './book-ratings.service';

describe('BookRatingsController', () => {
  let controller: BookRatingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookRatingsController],
      providers: [BookRatingsService],
    }).compile();

    controller = module.get<BookRatingsController>(BookRatingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
