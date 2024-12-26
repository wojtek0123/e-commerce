import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteBooksListsService } from './favourite-books-lists.service';

describe('FavouriteBooksListsService', () => {
  let service: FavouriteBooksListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavouriteBooksListsService],
    }).compile();

    service = module.get<FavouriteBooksListsService>(FavouriteBooksListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
