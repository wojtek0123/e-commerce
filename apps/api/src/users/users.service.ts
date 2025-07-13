import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { parseQueryParams } from '../common/utils/parse-query-params';
import { decode } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(body: CreateUserDto) {
    const hashedPassword = await hash(
      body.password,
      +this.config.get<string>('ROUNDS_OF_HASHING'),
    );

    return this.prisma.user.create({
      data: { ...body, password: hashedPassword },
    });
  }

  findAll(filters: { roleIn: string }) {
    const roles = parseQueryParams(filters.roleIn);

    const validatedRoles = roles.filter((role) =>
      ([Role.USER, Role.ADMIN] as string[]).includes(role),
    );

    return this.prisma.user.findMany({
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        role: true,
        updatedAt: true,
      },
      where: {
        ...(validatedRoles.length > 0 && {
          role: { in: validatedRoles as Role[] },
        }),
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        role: true,
        updatedAt: true,
        userInformation: true,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async updateForAdmin(id: string, body: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    let hashedPassword: string | undefined;

    if (body.newPassword) {
      hashedPassword = await hash(
        body.newPassword.toString(),
        +this.config.get<string>('ROUNDS_OF_HASHING'),
      );
    }

    if (body.email) {
      const isEmailUsed = await this.prisma.user.findFirst({
        where: { email: body.email },
      });

      if (isEmailUsed) {
        throw new ConflictException('Email is already used');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(hashedPassword && { password: hashedPassword }),
        ...(body.email && { email: body.email }),
        ...(body.role && { role: body.role }),
      },
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        role: true,
        updatedAt: true,
        userInformation: true,
      },
    });
  }

  async updateForUser(authHeader: string, id: string, body: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    const userId = getUserIdFromAccessToken(authHeader);
    let hashedPassword: string | undefined;

    if (userId !== id) {
      throw new UnauthorizedException();
    }

    if (!body.password && body.email) {
      throw new BadRequestException('Current password is required');
    }

    if (body.password) {
      const isPasswordCorrect = await compare(body.password, user.password);

      if (body.newPassword) {
        if (!isPasswordCorrect) {
          throw new BadRequestException('Incorrect password');
        }

        hashedPassword = await hash(
          body.newPassword.toString(),
          +this.config.get<string>('ROUNDS_OF_HASHING'),
        );
      }
    }

    if (body.email) {
      const isEmailUsed = await this.prisma.user.findFirst({
        where: { email: body.email },
      });

      if (isEmailUsed) {
        throw new ConflictException('Email is already used');
      }
    }

    const userInformation = await this.prisma.userInformation.findUnique({
      where: { userId },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(hashedPassword && { password: hashedPassword }),
        ...(body.email && { email: body.email }),
        userInformation: {
          ...(userInformation
            ? {
                update: {
                  ...(body.firstName && { firstName: body.firstName }),
                  ...(body.lastName && { lastName: body.lastName }),
                  ...(body.phone && { phone: body.phone }),
                },
              }
            : {
                create: {
                  firstName: body.firstName,
                  lastName: body.lastName,
                  phone: body.phone,
                },
              }),
        },
      },
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        role: true,
        updatedAt: true,
        userInformation: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        password: false,
        id: true,
        createdAt: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });
  }
}
