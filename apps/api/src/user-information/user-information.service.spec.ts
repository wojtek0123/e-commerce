import { Test, TestingModule } from '@nestjs/testing';
import { UserInformationsService } from './user-information.service';

describe('UserInformationsService', () => {
  let service: UserInformationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInformationsService],
    }).compile();

    service = module.get<UserInformationsService>(UserInformationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
