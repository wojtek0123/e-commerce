import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { TokenDto } from './token.dto';

export class AuthDto {
  @ApiProperty()
  tokens: TokenDto;

  @ApiProperty()
  user: UserDto;
}
