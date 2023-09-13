import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiCreatedResponse({ type: AuthDto })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('/register')
  @ApiCreatedResponse({ type: AuthDto })
  register(@Body() data: Prisma.UserCreateInput) {
    return this.authService.register(data);
  }
}
