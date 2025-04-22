import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';

@Injectable()
export class UserInformationsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserInformationDto) {
    // return this.prisma.userInformation.create({ data });
  }

  findAll() {
    return `This action returns all userInformations`;
  }

  async findOne(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    const userInformation = await this.prisma.userInformation.findUnique({
      where: { userId },
    });

    if (!userInformation) {
      throw new NotFoundException(`Not found user information`);
    }

    return userInformation;
  }

  update(id: number, updateUserInformationDto: UpdateUserInformationDto) {
    return `This action updates a #${id} userInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} userInformation`;
  }
}
