import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { UserDto } from '../users/dto/user.dto';
import { TokenDto } from './dto/token.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({ type: AuthDto })
  @ApiOperation({ summary: 'Sign in to existing user account' })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ApiCreatedResponse({ type: RegisterDto })
  @ApiOperation({ summary: 'Create a new user account' })
  register(@Body() { email, password }: RegisterDto) {
    return this.authService.register(email, password);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @ApiCreatedResponse({ type: UserDto })
  @ApiOperation({ summary: 'Log out from the user account' })
  logout(@Body() { id }: { id: User['id'] }) {
    return this.authService.logout(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiCreatedResponse({ type: TokenDto })
  @ApiOperation({ summary: 'Get refresh token' })
  refreshToken(@Body() { id, refreshToken }: RefreshTokenDto) {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
