import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentsService } from './user-payments.service';

describe('UserPaymentsService', () => {
  let service: UserPaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPaymentsService],
    }).compile();

    service = module.get<UserPaymentsService>(UserPaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
