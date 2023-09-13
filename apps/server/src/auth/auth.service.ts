import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { roundsOfHashing } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
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

  async register(user: CreateUserDto): Promise<AuthEntity> {
    const isUserExists = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(user.password, roundsOfHashing);

    const createdUser = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    return {
      accessToken: this.jwtService.sign({ userId: createdUser.id }),
    };
  }
}
