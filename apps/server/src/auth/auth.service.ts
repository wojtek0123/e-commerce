import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { roundsOfHashing } from '../users/users.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(data: Prisma.UserCreateInput) {
    const isUserExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(data.password, roundsOfHashing);

    const createdUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return {
      accessToken: this.jwtService.sign({ userId: createdUser.id }),
    };
  }
}
