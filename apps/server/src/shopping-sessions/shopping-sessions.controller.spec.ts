import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingSessionsController } from './shopping-sessions.controller';
import { ShoppingSessionsService } from './shopping-sessions.service';

describe('ShoppingSessionsController', () => {
  let controller: ShoppingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingSessionsController],
      providers: [ShoppingSessionsService],
    }).compile();

    controller = module.get<ShoppingSessionsController>(ShoppingSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
