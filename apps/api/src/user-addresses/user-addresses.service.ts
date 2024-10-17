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
      throw new UnauthorizedException(`You don't have an access`);
    }

    return this.prisma.userAddress.create({
      data: {
        ...data,
        userId,
      },
      include: { country: true },
    });
  }

  findAll(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You are unauthorized to get this data');
    }

    return this.prisma.userAddress.findMany({
      where: { userId },
      include: {
        country: true,
      },
    });
  }

  findOne(authHeader: string, id: UserAddress['id']) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException('You are unauthorized to get this data');
    }

    return this.prisma.userAddress.findUnique({
      where: { id, userId },
      include: {
        country: true,
      },
    });
  }

  update(
    authHeader: string,
    id: UserAddress['id'],
    data: UserAddressUpdateDto,
  ) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException(`You don't have an access`);
    }

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
