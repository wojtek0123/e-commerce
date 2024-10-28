import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { TokenDto } from './token.dto';

export class AuthDto {
  @ApiProperty()
  tokens: TokenDto;

  @ApiProperty()
  user: User;
}
