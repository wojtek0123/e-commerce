import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentsController } from './user-payments.controller';
import { UserPaymentsService } from './user-payments.service';

describe('UserPaymentsController', () => {
  let controller: UserPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPaymentsController],
      providers: [UserPaymentsService],
    }).compile();

    controller = module.get<UserPaymentsController>(UserPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
