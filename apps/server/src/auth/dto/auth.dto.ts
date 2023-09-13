import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  accessToken: string;
}
