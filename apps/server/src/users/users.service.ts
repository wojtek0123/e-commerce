import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const hashedPassword = await hash(data.password, roundsOfHashing);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        firstName: true,
        role: true,
        surname: true,
        updatedAt: true,
      },
    });
  }

  findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where,
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        firstName: true,
        role: true,
        surname: true,
        updatedAt: true,
      },
    });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ) {
    if (data.password) {
      const hashedPassword = await hash(
        data.password.toString(),
        roundsOfHashing
      );

      data = { ...data, password: hashedPassword };
    }

    return this.prisma.user.update({
      where,
      data,
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        firstName: true,
        role: true,
        surname: true,
        updatedAt: true,
      },
    });
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({
      where,
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        firstName: true,
        role: true,
        surname: true,
        updatedAt: true,
      },
    });
  }
}
