import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteBooksListsController } from './favourite-books-lists.controller';
import { FavouriteBooksListsService } from './favourite-books-lists.service';

describe('FavouriteBooksListsController', () => {
  let controller: FavouriteBooksListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteBooksListsController],
      providers: [FavouriteBooksListsService],
    }).compile();

    controller = module.get<FavouriteBooksListsController>(FavouriteBooksListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
