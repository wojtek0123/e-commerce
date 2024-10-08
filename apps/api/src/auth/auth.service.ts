import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { roundsOfHashing } from '../users/users.service';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { shoppingSessions: { select: { id: true, cartItems: true } } },
    });

    if (!user) {
      throw new NotFoundException('Incorrect email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const tokens = await this._getTokens(user.id, user.email);

    await this._updateRefreshToken(user.id, tokens.refreshToken);

    const userWithoutPasswod = omit(user, 'password');

    return { tokens, user: userWithoutPasswod };
  }

  async register(email: string, password: string) {
    const isUserExists = await this.prisma.user.findUnique({
      where: { email: email },
      include: { shoppingSessions: { select: { id: true, cartItems: true } } },
    });

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this._hashData(password);
    const data: Prisma.UserCreateInput = {
      email,
      password,
    };

    const createdUser = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    const tokens = await this._getTokens(createdUser.id, createdUser.email);
    await this._updateRefreshToken(createdUser.id, tokens.refreshToken);

    const user = omit(createdUser, 'password');
    return { tokens, user };
  }

  async logout(id: User['id']) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken: null },
    });
  }

  private async _updateRefreshToken(id: User['id'], refreshToken: string) {
    const hashedRefreshToken = await this._hashData(refreshToken);
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async _getTokens(id: User['id'], email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '2m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(id: User['id'], refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this._getTokens(user.id, user.email);
    await this._updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private _hashData(data: string) {
    return hash(data, roundsOfHashing);
  }
}
