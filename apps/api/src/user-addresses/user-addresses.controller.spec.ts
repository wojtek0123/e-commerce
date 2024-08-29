import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressesController } from './user-addresses.controller';
import { UserAddressesService } from './user-addresses.service';

describe('UserAddressesController', () => {
  let controller: UserAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAddressesController],
      providers: [UserAddressesService],
    }).compile();

    controller = module.get<UserAddressesController>(UserAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
