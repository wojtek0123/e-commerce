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

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(body: CreateUserDto) {
    const hashedPassword = await hash(
      body.password,
      this.config.get<string>('ROUNDS_OF_HASHING'),
    );

    return this.prisma.user.create({
      data: { ...body, password: hashedPassword },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
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
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(authHeader: string, id: string, body: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    const userId = getUserIdFromAccessToken(authHeader);

    if (userId !== id) {
      throw new UnauthorizedException();
    }

    if (!body.password) {
      throw new BadRequestException('Current password is required');
    }

    const isPasswordCorrect = await compare(body.password, user.password);

    let hashedPassword: string | undefined;

    if (body.newPassword) {
      if (!isPasswordCorrect) {
        throw new BadRequestException('Incorrect password');
      }

      hashedPassword = await hash(
        body.newPassword.toString(),
        this.config.get<string>('ROUNDS_OF_HASHING'),
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
      where: { id: userId },
      data: {
        ...(hashedPassword && { password: hashedPassword }),
        ...(body.email && { email: body.email }),
      },
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
