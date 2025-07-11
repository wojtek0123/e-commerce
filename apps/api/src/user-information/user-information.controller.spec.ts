import { Test, TestingModule } from '@nestjs/testing';
import { UserInformationsController } from './user-information.controller';
import { UserInformationsService } from './user-information.service';

describe('UserInformationsController', () => {
  let controller: UserInformationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInformationsController],
      providers: [UserInformationsService],
    }).compile();

    controller = module.get<UserInformationsController>(
      UserInformationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
