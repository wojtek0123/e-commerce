import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { decode } from 'jsonwebtoken';
import { UserAddress } from './entities/user-addresses.entity';
import { UserAddressUpdateDto } from './dto/user-address-update.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class UserAddressesService {
  constructor(private prisma: PrismaService) {}

  create(authHeader: string, data: UserAddressCreateDto) {
    const decodedAccessToken = decode(authHeader.split(' ')[1]);

    if (!decodedAccessToken) {
      throw new UnauthorizedException('You are not log in');
    }

    return this.prisma.userAddress.create({
      data: {
        ...data,
        userId: +decodedAccessToken.sub,
      },
    });
  }

  find(authHeader: string) {
    const decodedAccessToken = decode(authHeader.split(' ')[1]) as JwtPayload;

    if (!decodedAccessToken) {
      throw new UnauthorizedException('You are unauthorized to get this data');
    }

    return this.prisma.userAddress.findUnique({
      where: { userId: +decodedAccessToken.sub },
      include: {
        country: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.userAddress.findUnique({ where: { id } });
  }

  update(id: UserAddress['id'], data: UserAddressUpdateDto) {
    return this.prisma.userAddress.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.userAddress.delete({ where: { id } });
  }
}
