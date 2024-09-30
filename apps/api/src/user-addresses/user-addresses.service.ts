import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { UserAddress } from './entities/user-addresses.entity';
import { UserAddressUpdateDto } from './dto/user-address-update.dto';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';

@Injectable()
export class UserAddressesService {
  constructor(private prisma: PrismaService) {}

  create(authHeader: string, data: UserAddressCreateDto) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You are not log in');
    }

    return this.prisma.userAddress.create({
      data: {
        ...data,
        userId,
      },
      include: { country: true },
    });
  }

  find(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You are unauthorized to get this data');
    }

    return this.prisma.userAddress.findUnique({
      where: { userId },
      include: {
        country: true,
      },
    });
  }

  update(id: UserAddress['id'], data: UserAddressUpdateDto) {
    return this.prisma.userAddress.update({
      where: { id },
      data,
      include: { country: true },
    });
  }

  remove(id: UserAddress['id']) {
    return this.prisma.userAddress.delete({
      where: { id },
      include: { country: true },
    });
  }
}
