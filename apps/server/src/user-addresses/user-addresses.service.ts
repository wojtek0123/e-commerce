import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserAddressesService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserAddressCreateInput) {
    return this.prisma.userAddress.create({ data });
  }

  findAll() {
    return this.prisma.userAddress.findMany();
  }

  findOne(where: Prisma.UserAddressWhereUniqueInput) {
    return this.prisma.userAddress.findUnique({ where });
  }

  update(
    where: Prisma.UserAddressWhereUniqueInput,
    data: Prisma.UserAddressUpdateInput
  ) {
    return this.prisma.userAddress.update({ where, data });
  }

  remove(where: Prisma.UserAddressWhereUniqueInput) {
    return this.prisma.userAddress.delete({ where });
  }
}
