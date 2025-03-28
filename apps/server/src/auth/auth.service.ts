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
      throw new NotFoundException('Incorrect email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(email: string, password: string) {
    const isUserExists = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(password, roundsOfHashing);
    const data: Prisma.UserCreateInput = {
      email,
      password,
    };

    const createdUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    const bearerToken = this.jwtService.sign(
      { userId: createdUser.id }
      // { algorithm: 'RS256', expiresIn: '7d', subject: createdUser.id }
    );
    // console.log(bearerToken);

    return {
      accessToken: bearerToken,
    };
  }
}
