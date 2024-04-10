import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class AuthDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserDto;
}
