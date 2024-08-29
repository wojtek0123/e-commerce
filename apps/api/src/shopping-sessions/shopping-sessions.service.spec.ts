import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingSessionsService } from './shopping-sessions.service';

describe('ShoppingSessionsService', () => {
  let service: ShoppingSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoppingSessionsService],
    }).compile();

    service = module.get<ShoppingSessionsService>(ShoppingSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
