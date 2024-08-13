import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressesService } from './user-addresses.service';

describe('UserAddressesService', () => {
  let service: UserAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAddressesService],
    }).compile();

    service = module.get<UserAddressesService>(UserAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
